invoke-expression 'cmd /c start powershell -Command { npm run start -w=ui }'
invoke-expression 'cmd /c start powershell -Command { npm run start -w=server }'
invoke-expression 'cmd /c start powershell -Command { cd text_server; mix run --no-halt }'