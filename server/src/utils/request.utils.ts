import axios from 'axios';
import { serialize } from 'bson';
import express, { Request, Response, Application } from 'express';
import { ModuleConfig } from '../classes/moduleConfig';

type Handler = (req: any, res: Response) => Promise<void>;
type Resolver = (body: any) => Promise<string[] | Error>;
type Serializer = (data: Object) => Object | Buffer;
type PicturePromisePayload = { paths: string[]; options: ModuleConfig };

export const getHandler: (resolver: Resolver, serializer?: Serializer) => Handler =
	(resolver, serializer = (data) => data) =>
	async (req, res) => {
		try {
			const data = { pictures: await resolver(req.body) };
			res.status(200).send(serializer(data));
		} catch (err) {
			console.log(err);
			res.status(500).send(err);
		}
	};

async function picturePromise(route: string, payload: PicturePromisePayload): Promise<string[]> {
	const res = await axios.post(route, JSON.stringify(payload), {
		headers: { 'Content-Type': 'application/json' },
	});

	const { pictures } = res.data;
	if (pictures instanceof Array) {
		return pictures;
	} else {
		throw new Error(`Bad pictures format: ${pictures}`);
	}
}

export const promiseReduce: (
	configs: { route: string; options: ModuleConfig }[],
	pictures: string[],
) => Promise<string[]> = (configs, pictures) =>
	configs.reduce(
		(prevPromise, { route, options }) =>
			prevPromise.then((paths) => picturePromise(route, { paths, options })),
		(async () => {
			return pictures;
		})(),
	);
