:: AdmX - Aria2 Download Manager
:: Release by aa65535
:: Time: 2013-12-10 13:00:24
:: External command: aria2c.exe, wfr.exe

@echo off
title Aria2& color f3& mode con: cols=80 lines=8& setlocal enabledelayedexpansion
:: 检查Aria2是否可用
aria2c& cls
if !errorlevel! gtr 1 echo aria2c.exe unavailable!& pause>nul& exit
:: 检查配置文件和下载目录
if not exist AdmX.ini call :admxini
if not exist aria2.conf call :aria2conf
if not exist DwnlData mkdir DwnlData
:: 载入配置
:init
for /f "eol=# delims=" %%i in (AdmX.ini) do set "%%i"
:: 限速设置
set "dml="
if !speed_limit! equ 1 (
    set /p "init_speed=限速值KB/s(默认0不限制)："& set /a "init_speed=!init_speed!"
    if !init_speed! gtr 0 (set "dml=--max-download-limit=!init_speed!K")
)
:: 下载列表判断
if "%~1"=="" (
    if exist "!list_name!" (set "lst=!list_name!") else (call :error0& goto :input)
) else (
    set "lst=%~1"
)
:: 处理文件名中的"!"
wfr %lst% -f:"^!" -t:"！"
:: 读取下载列表并启动下载
for /f "usebackq eol=# tokens=1,2 delims=\" %%i in ("!lst!") do (
    set "fnm=%%i"& set "url=%%j"
    cls& if !init_speed!==0 (title Aria2：!fnm!) else (title [LMT:!init_speed!KB] Aria2：!fnm!)
    cls& aria2c --conf-path=aria2.conf !dml! -o "DwnlData/!fnm!" "!url!"
    if !errorlevel! equ 0 (wfr !lst! -f:"%%i" -t:"#%%i")
    if !errorlevel! equ 7 goto init
)
:: 若下载列表中URI不可用则使用输入模式
if "!url!"=="" (call :error1& goto input)
goto shut
:: 输入模式
:input
set "mix=0"& set /p "url=输入下载链接："&& echo "!url!"|find "//"|| goto input
cls& echo "!url!"| find "\http"&& set "mix=1"
cls
:file
if !mix!==1 (
    for /f "tokens=1,2 delims=\" %%i in ("!url!") do (set "fnm=%%i"& set "url=%%j")
) else (
    cls& set /p "fnm=输入文件名："|| goto file
)
if !lim!==0 (title Aria2：!fnm!) else (title [LMT:!init_speed!KB] Aria2：!fnm!)
cls& aria2c --conf-path=aria2.conf !dml! -o "DwnlData/!fnm!" "!url!"
if !errorlevel! equ 7 goto init
:: 完成关机功能
:shut
set /a hh=!time:~0,2!
if !shut! equ 1 (
    if !hh! leq !period_end! (
        if !hh! geq !period_start! (
            cls& choice /c YN /t 10 /d Y /m 是否关闭计算机& if !errorlevel! equ 1 (shutdown -s -t 30)
        ) else (
            timeout /t 300& goto shut
        )
    )
)
exit
:: 批处理配置
:admxini
echo 请按任意键开始配置本批处理. . .& pause>nul
cls& set /p speed_limit=是否开启限速功能[0.不开启，1.开启，默认1]：
if "!speed_limit!"=="" set speed_limit=1
cls& set /p list_name=输入默认下载列表文件名[默认down.lst]：
if "!list_name!"=="" set list_name=down.lst
echo #使用ANSI编码保存, 格式：filename\uri>>!list_name!
cls& set /p shut=是否开启指定时间段下载完成后关机功能[0.不开启，1.开启，默认1]：
if "!shut!"=="" set shut=1
cls& (
    echo #是否开启限速功能[0.不开启, 1.开启]
    echo speed_limit=!speed_limit!
    echo #默认限速值[KB/s]
    echo init_speed=^0
    echo #默认下载列表文件名
    echo list_name=!list_name!
    echo #是否开启指定时间段下载完成后关机功能[0.不开启，1.开启]
    echo shut=!shut!
)>AdmX.ini|| goto admxini
if !shut!==1 (
    echo 下载完成后关机功能已开启！请分别输入作用时段的开始和结束时间。
    echo 如在3点到6点之间使用下载完成关机功能，分别在开始时间输入3、结束时间输入6即可。
    set /p period_start=输入下载关机时间段开始时间[数字，默认3]：
    if "!period_start!"=="" set period_start=3
    set /p period_end=输入下载关机时间段结束时间[数字，默认6]：
    if "!period_end!"=="" set period_end=6
    (
        echo #下载关机时间段开始时间
        echo period_start=!period_start!
        echo #下载关机时间段结束时间
        echo period_end=!period_end!
    )>>AdmX.ini|| goto admxini
)
cls& goto :eof
:: Aria2配置
:aria2conf
echo 请按任意键开始配置Aria2. . .& pause>nul
cls& set /p disk-cache=设置文件缓存[单位MB，填数字，默认16]：
if "!disk-cache!"=="" set disk-cache=16
cls& set /p file-allocation=文件预分配[none^>falloc^>prealloc，NTFS建议使用falloc，默认none]：
if "!file-allocation!"=="" set file-allocation=none
cls& set /p max-connection-per-server=同服务器连接数[数字，默认2]：
if "!max-connection-per-server!"=="" set max-connection-per-server=2
cls& set /p split=单文件最大线程数[数字，默认2]：
if "!split!"=="" set split=2
(
    echo #文件缓存, 需要1.16及以上版本
    echo disk-cache=!disk-cache!M
    echo #文件预分配, 能有效降低文件碎片, 缺点是预分配需要时间, 所需时间 none ^< falloc ^< prealloc, falloc和trunc则需要文件系统和内核支持
    echo file-allocation=!file-allocation!
    echo #追加HTTP请求头, 用于迅雷离线下载验证
    echo header=Cookie: gdriveid=
    echo #断点续传
    echo continue=true
    echo #同服务器连接数
    echo max-connection-per-server=!max-connection-per-server!
    echo #单文件最大线程数
    echo split=!split!
    echo #最小文件分片大小, 下载线程数上限取决于能分出多少片, 对于小文件重要
    echo min-split-size=2M
)>aria2.conf|| goto aria2conf
cls& goto :eof
:: 错误信息
:error0
cls& echo 下载列表没有找到！使用手动输入模式。
goto :eof
:error1
cls& echo 下载列表任务为空！使用手动输入模式。
goto :eof
