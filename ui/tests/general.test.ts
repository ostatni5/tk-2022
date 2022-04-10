/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import Header from '$lib/components/Header.svelte';

describe('Test if app name in header is generated', () => {
    test('Header test', () => {
        const { getByText } = render(Header);
        expect(getByText('ImageFinder')).toBeInTheDocument();
    });
});
