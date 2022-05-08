invoke-expression 'cmd /c start powershell -Command { npm run start -w=ui }'
invoke-expression 'cmd /c start powershell -Command { npm run main -w=node_servers }'
invoke-expression 'cmd /c start powershell -Command { npm run metadata -w=node_servers }'
invoke-expression 'cmd /c start powershell -Command { cd text_server; mix run --no-halt }'
invoke-expression 'cmd /c start powershell -Command { cd weather_server; python3 weather_server.py }'

