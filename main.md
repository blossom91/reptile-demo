---
title: shell常用命令
toc: true
mathjax: true
comments: true
date: 2017-09-08 14:01:25
updated: 2017-12-13
tags: shell
categories: 杂货铺
---


`shell`既是一种命令语言，又是一种程序设计语言,是用户使用Linux 的桥梁
随着深入学习,此篇文章持续更新...

<!-- more -->

### 注意事项

- 条件表达式要放在方括号之间,并且要有空格，例如: [$a==$b] 是错误的，必须写成 [ $a == $b ]
- 单引号中变量无效转义符无效,双引号变量有效转义符有效

### 常用命令

```shell
# 重新执行刚修改的文件,使立即成效
$ source [file]

# 打印,等同于log
$ echo ...

# 可以传入参数 $0是脚本名 $1是1
$ sh file.sh 1 2 3

# 传入参数的个数  所有传入参数
$ echo $#  $*

# 上个命令的退出状态，或函数的返回值
$ echo $?

# 当前Shell进程ID。对于 Shell 脚本，就是这些脚本所在的进程ID
$ echo $$

# -e 开启转义  \n开启换行  \c不换行
$ echo -e "OK! \n"
```
---
### 设置变量

```shell
# 定义变量,等号两边不可有空格
$ name="runoob.com"

# 设置只读变量
$ readonly name

# 删除变量
$ unset name

# name 接收标准输入的变量
$ read name
```

---
### 字符串

```shell
# 字符串拼接方法
$ greeting="hello, "$name" !"
$ greeting_1="hello, ${name} !"

# 获取字符串长度
$ echo ${#name}

# 从字符串第 2 个字符开始截取 4 个字符
$ echo ${name:1:4}

# *// 表示从左边开始删除第一个 // 号及左边的所有字符
$ echo ${name#*//}

# ##表示从左边开始删除最右边一个/及左边的字符
$ echo ${name##*/}

# %/* 表示从右边开始，删除第一个 / 号及右边的字符
$ echo ${name%/*}
```

---
### 数组

```shell
# 定义数组
$ array_name=(value0 value1 value2 value3)

# 读取数组
$ ${数组名[下标]}

# 获取所有数组
$ ${array_name[*]}

# 获取数组长度
$ length=${#array_name[*]}

# 获取某个数组元素长度
$ lengthn=${#array_name[n]}

```

---
### expr

```shell
# MAC 中 shell 的 expr 语法是：$((表达式))

# expr 运算符
+ - * / % = == !=

# 非运算 或运算 与运算
! -o  '-a &&' 
```

---
##  Mac OSX 命令行

### 一些常用命令

```shell
# 允许所有来源
$ sudo spctl --master-disable

# 显示隐藏文件
$ defaults write com.apple.finder AppleShowAllFiles -bool true killall Finder

# 恢复文件隐藏
$ defaults write com.apple.finder AppleShowAllFiles -bool false killall Finder

# 标题栏显示完整路径
$ defaults write com.apple.finder _FXShowPosixPathInTitle -bool YES killall Finder

# 标题栏显示当前路径
$ defaults write com.apple.finder _FXShowPosixPathInTitle -bool NO killall Finder

```

### 快捷命令

|功能说明|快捷键|
|:-:|:-:|
|查询目录文件|ls -a(所有)|
|转换目录|cd|
|转换到根目录|cd /|
|转换到上一级目录|cd ..|
|显示当前目录路径|pwd|
|新建一个文件|touch|
|建立新目录|mkdir|
|打开文件|open|
|删除一个目录|rmdir|
|拷贝文件|cp|
|删除文件|rm|
|移动文件|mv|
|显示文件类型|file|
|显示进程状态|ps|
|终止进程|kill|
|显示当前时间|date|
|显示日历|cal|
|统计程序的执行时间|time|
|显示操作系统信息|uname -a|
|清除屏幕信息|clear|
|终止操作|Ctrl + c|
|光标回到命令行首(尾)|Ctrl + a(e)|
|删除光标处到行首(尾)的字符|Ctrl + w(k)|
|删除整个命令行文本字符|Ctrl + u|



