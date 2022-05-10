invoke-expression 'cmd /c start powershell -Command { npm run start -w=ui }'
invoke-expression 'cmd /c start powershell -Command { npm run main -w=node_servers }'
invoke-expression 'cmd /c start powershell -Command { npm run metadata -w=node_servers }'
invoke-expression 'cmd /c start powershell -Command { cd text_server; mix run --no-halt }'
<<<<<<< HEAD
invoke-expression 'cmd /c start powershell -Command { cd .\people_server\build\bin\; .\peopleServer.exe}'
invoke-expression 'cmd /c start powershell -Command { weather_server/env/Scripts/Activate.ps1; python3 weather_server }'

=======
invoke-expression 'cmd /c start powershell -Command { weather_server/env/Scripts/Activate.ps1; python3 ./weather_server }'
invoke-expression 'cmd /c start powershell -Command { cd ./people_server/build/bin; ./peopleServer.exe}'
>>>>>>> d3070bc71f24bbf65be3b52e72825acb3983cb43
