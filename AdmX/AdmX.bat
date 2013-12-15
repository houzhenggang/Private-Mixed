:: AdmX - Aria2 Download Manager for Xunlei
:: Release by aa65535
:: Time: 2013-12-13 03:08:57
:: External Command: aria2c.exe, wfr.exe

@echo off
title Aria2& color f3& mode con: cols=80 lines=8& setlocal enabledelayedexpansion
:: 检查Aria2是否可用
aria2c& cls
if !errorlevel! gtr 1 echo aria2c.exe not found!& pause>nul& exit
:: 检查配置文件和下载目录
if not exist AdmX.ini call :admxini
if not exist aria2.conf call :aria2conf
if not exist Aria2Data mkdir Aria2Data
:: 载入配置
:init
for /f "eol=# delims=" %%i in (AdmX.ini) do set "%%i"
:: 限速设置
set "dml=--max-download-limit=!default_speed!"
if !speed_limit! equ 1 (
    cls& set /p "default_speed=限速值KB/s："& set /a "default_speed=!default_speed!"
    if !default_speed! gtr 0 (set "dml=--max-download-limit=!default_speed!K")
)
:: 下载列表判断
if "%~1"=="" (
    if exist "!list_file!" (set "lst=!list_file!") else (echo 下载列表没有找到！& pause>nul& exit)
) else (
    set "lst=%~1"
)
:: 处理文件名中的"!"
wfr %lst% -f:"^!" -t:"！"
:: 读取下载列表并启动下载
for /f "usebackq eol=# tokens=1,2,3 delims=\" %%i in ("!lst!") do (
    set "fnm=%%i"& set "url=%%j"& set "gid=%%k"& set "header="
    cls& if !default_speed!==0 (title Aria2：!fnm!) else (title [LMT:!default_speed!KB] Aria2：!fnm!)
    if defined gid (set "header=--header="Cookie: !gid!"")
    cls& aria2c --conf-path=aria2.conf !header! !dml! -o "Aria2Data/!fnm!" "!url!"
    if !errorlevel! equ 0 (wfr !lst! -f:"%%i" -t:"#%%i")
    if !errorlevel! equ 7 goto init
)
:: 若下载列表中URI不可用则退出
if not defined url (echo 下载列表任务为空！& pause>nul& exit)
goto shut
:: 完成关机功能
:shut
set /a hh=!time:~0,2!
if !shut! equ 1 (
    if !hh! leq !period_end! (
        if !hh! geq !period_start! (
            cls& choice /c YN /t 10 /d Y /m 是否关闭计算机& if !errorlevel! equ 1 (shutdown -s -t 30)
        ) else (
            timeout /t 300 /nobreak& goto shut
        )
    )
)
exit
:: 批处理配置
:admxini
echo 请按任意键开始配置本批处理. . .& pause>nul
cls& set /p speed_limit=是否开启限速功能[0.不开启，1.开启，默认1]：
if not defined speed_limit set speed_limit=1
cls& set /p list_file=输入默认下载列表文件名[默认down.lst]：
if not defined list_file set list_file=down.lst
echo #使用ANSI编码保存, 格式: 文件名\下载链接\gdriveid>>!list_file!
cls& set /p shut=是否开启指定时间段下载完成后关机功能[0.不开启，1.开启，默认1]：
if not defined shut set shut=1
cls& (
    echo #是否开启限速功能[0.不开启, 1.开启]
    echo speed_limit=!speed_limit!
    echo #默认限速值, 当提示输入限速值时回车跳过则使用该值[单位: KB/s, 0为不限制]
    echo default_speed=^0
    echo #默认下载列表文件名
    echo list_file=!list_file!
    echo #是否开启指定时间段下载完成后关机功能[0.不开启，1.开启]
    echo shut=!shut!
)>AdmX.ini|| goto admxini
if !shut!==1 (
    echo 下载完成后关机功能已开启！请分别输入作用时段的开始和结束时间。
    echo 如在3点到6点之间使用下载完成关机功能，分别在开始时间输入3、结束时间输入6即可。
    set /p period_start=输入下载关机时间段开始时间[数字，默认3]：
    if not defined period_start set period_start=3
    set /p period_end=输入下载关机时间段结束时间[数字，默认6]：
    if not defined period_end set period_end=6
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
cls& set /p disk-cache=设置磁盘缓存[单位MB，填数字，默认16]：
if not defined disk-cache set disk-cache=16
chkntfs %~d0|find "NTFS"&& (cls& set type=falloc)|| (cls& set type=none)
cls& set /p file-allocation=文件预分配[速度: none ^> falloc ^> prealloc，默认!type!]：
if not defined file-allocation set file-allocation=!type!
cls& set /p max-connection-per-server=同一服务器连接数[数字，默认2]：
if not defined max-connection-per-server set max-connection-per-server=2
cls& set /p split=单文件最大线程数[数字，默认2]：
if not defined split set split=2
(
    echo #磁盘缓存, 需要1.16及以上版本
    echo disk-cache=!disk-cache!M
    echo #文件预分配, 能有效降低磁盘碎片, 缺点是需要消耗时间, 所需时间 none ^< falloc ^< prealloc, falloc和trunc则需要文件系统和内核支持
    echo file-allocation=!file-allocation!
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
