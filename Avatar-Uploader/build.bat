@echo off
if exist build (
  del build /f/s/q
) else (
  md build
)
C:\Python27\Scripts\cxfreeze gui.py --install-dir=build
