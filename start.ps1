invoke-expression 'cmd /c start powershell -Command { npm run start -w=ui }'
invoke-expression 'cmd /c start powershell -Command { npm run main -w=server }'
invoke-expression 'cmd /c start powershell -Command { npm run metadata -w=server }'
invoke-expression 'cmd /c start powershell -Command { cd text_server; mix run --no-halt }'