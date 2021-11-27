import imgDigits from '../assets/img/work-digits.jpg';
import imgGlove from '../assets/img/work-glove.jpg';
import imgLive2dWeb from '../assets/img/work-live2d-web.jpg';
import imgMagic from '../assets/img/work-magic.jpg';
import imgMaika from '../assets/img/work-maika.jpg';
import imgNep from '../assets/img/work-nep.jpg';
import imgPaint from '../assets/img/work-paint.jpg';
import imgPixiLive2d from '../assets/img/work-pixi-live2d.jpg';
import imgTravel from '../assets/img/work-travel.jpg';
import { parseMarkdown } from '../tools/markdown';

export const WORKS = [
    {
        title: 'Pixi Live2D Display',
        type: 'Web 工具库',
        icon: 'web',
        img: imgPixiLive2d,
        date: '2020.03 - 2021.03',
        github: 'https://github.com/guansss/pixi-live2d-display',
        video: 'https://www.bilibili.com/video/BV1Jp4y1W7s3/',
        desc: `### 为 PixiJS 动画引擎创建的 Live2D 插件

可以将任意版本的 Live2D 模型作为引擎中的一个 Sprite 来进行变换、交互、应用滤镜等操作

除此之外由于 Live2D 的官方框架实在太烂，所以对其进行了部分重写以提供简单统一的 API 并提升了一些性能

最初是在 Neptune Live2D 里遇到了将这两个动画引擎结合起来的需求，但是比较不满意已有的 pixi-live2d 插件的 API，所以就自己实现了这个功能，后来将其提取出来作为一个开源插件 pixi-lve2d-display`,
    },
    {
        title: 'Live2D Viewer Online',
        type: 'Web 应用',
        icon: 'web',
        img: imgLive2dWeb,
        date: '2020.12 - 2021.03',
        github: 'https://github.com/guansss/live2d-viewer-web',
        webpage: 'https://guansss.github.io/live2d-viewer-web/',
        desc: `### 网页版的 Live2D Viewer

在准备发布 pixi-lve2d-display 时，作为其 demo 开发的一个项目，后来觉得比较有用就进行了进一步的开发

- 同时展示多个任意版本 Live2D 模型
- 拖动、点击等简单的交互
- 表情、动作的切换和进度显示
- 预设的简单滤镜
- 对模型仓库的在线浏览，可以直接从中选取并加载在线模型`,
    },
    {
        title: 'Puzzle #2',
        type: '网页',
        icon: 'web',
        img: imgTravel,
        date: '2020.10',
        webpage:
            'https://guansss.github.io/puzzles/travel/index.html?dst=https%3A%2F%2Fpenlab.cn%2Fpuzzle%3Fsolved%3Dtravel%26key%3D%24ID%24',
        desc: `### The Travel 谜题

一道同时存在于网页与代码里的双重谜题，似乎散发着神秘的气息……？`,
    },
    {
        title: 'Neptune Live2D',
        type: 'Web 壁纸',
        icon: 'web',
        img: imgNep,
        date: '2017.10 - 2020.03',
        github: 'https://github.com/guansss/nep-live2d',
        video: 'https://www.bilibili.com/video/BV1EJ411W7rM/',
        dist: 'https://steamcommunity.com/sharedfiles/filedetails/?id=1078208425',
        desc: `### 运行在 [Wallpaper Engine](https://store.steampowered.com/app/431960/Wallpaper_Engine/) 上的 Live2D 动态壁纸

作为壁纸平台上最完善、订阅量最高的 Live2D 壁纸，提供了一整套 Live2D 模型管理系统，支持模型的导入、移动缩放、节日问候、多语言字幕等功能

同时支持背景图片/视频的自定义，内置两种特效，并提供主题系统，可以随时进行模型、背景、特效的组合切换

可操作的 UI 组件均为特殊定制，在保证适配各种分辨率的同时，完美适应了在桌面壁纸环境下的奇葩交互限制

项目早期在 2017 年开发，由于当时技术有限，功能和代码结构都比较简陋，后来在 2019 年进行了重写，开发日志也记录于本站`,
    },
    {
        title: 'AL Combat Counter',
        type: '桌面应用',
        icon: 'pc',
        img: 'https://cdn.jsdelivr.net/gh/guansss/al-combat-counter/preview.jpg',
        date: '2020.02',
        github: 'https://github.com/guansss/al-combat-counter',
        desc: `### 碧蓝航线战斗计数器

为了在直播碧蓝航线的 EX 挑战时对战斗数据进行统计而开发的工具，可以检测游戏画面以自动记录出击次数

因为除了我之外基本上没有人会直播这个挑战，所以就懒得公开发布了🙃`,
    },
    {
        title: 'Magic of Stella',
        type: 'Web 壁纸',
        icon: 'web',
        img: imgMagic,
        date: '2020.01',
        webpage: 'https://guansss.github.io/magic-of-stella/',
        github: 'https://github.com/guansss/magic-of-stella',
        dist: 'https://steamcommunity.com/sharedfiles/filedetails/?id=1973329389',
        desc: `### 运行在 [Wallpaper Engine](https://store.steampowered.com/app/431960/Wallpaper_Engine/) 上的粒子特效壁纸

为了还原动画《斯特拉的魔法》的片尾而做的壁纸

带有音频响应效果，作为壁纸使用时可以响应电脑上的实时音频，在线访问时则直接播放音乐以读取音频

最初基于 PixiJS 开发，但是性能较差，于是改用了 three.js`,
    },
    {
        title: 'Bad Paint',
        type: '动画脚本',
        icon: 'pc',
        img: imgPaint,
        date: '2019.02',
        github: 'https://github.com/guansss/bad-paint',
        video: 'https://www.bilibili.com/video/BV16b411S7ka/',
        desc: `### 在游戏《碧蓝航线》中播放 Bad Apple 动画

游戏中存在一个像素点阵画板，通过脚本控制像素绘制的位置和颜色，再将每张图片逐一播放，即可模拟出连续的动画效果`,
    },
    {
        title: 'Blend-S Maika',
        type: 'Web 壁纸',
        icon: 'web',
        img: imgMaika,
        date: '2018.01',
        dist: 'https://steamcommunity.com/sharedfiles/filedetails/?id=1285334213',
        desc: `### 运行在 [Wallpaper Engine](https://store.steampowered.com/app/431960/Wallpaper_Engine/) 上的动画壁纸

从动画视频中截取出一帧制作成动态壁纸，并添加了简单的粒子特效

尝试做了一个简易的物理系统，但是对动画原理的理解比较浅薄，导致头发的效果非常拉胯 :/`,
    },
    {
        title: 'Data Glove',
        type: '硬件/嵌入式',
        icon: 'hardware',
        img: imgGlove,
        date: '2017.06 - 2017.10',
        desc: `### 数据手套

<video autoplay muted loop width="600" height="338" src="https://penlab.cn/res/vids/glove_gesture.webm"></video>

未来道具二号

由 Arduino 驱动的无线数据手套，可以捕获手部的位移与角度，以及手指的弯曲度数据，并通过 wifi 传输至上位机

至于手势识别，仅仅是能判断各手指的“弯曲”与“伸直”状态而已，更复杂的手势识别则缺少实现的技术

本来一直很想加上触觉反馈功能，但毕业之后就不了了之了`,
    },
    {
        title: 'Digits Calculator',
        type: 'Android 应用',
        icon: 'android',
        img: imgDigits,
        date: '2016.10 - 2017.06',
        desc: `### 游戏 [Two Digits](https://store.steampowered.com/app/371330/Two_Digits/) 的外挂程序

<video autoplay controls muted loop width="400" height="649" src="https://penlab.cn/res/vids/digits_calculator.webm"></video>

Two Digits 的游戏规则为从 9 个数字中选择不重复的两组，使得它们的和相等，共 250 个关卡

游戏本身实在太过枯燥，于是开发了这个外挂 app，功能是利用手机摄像头来识别屏幕上的数字，并给出答案

纯手写的图像识别算法，准确率还不错

之所以不直接在屏幕上截图而是用手机摄像头来识别，是因为当时对桌面开发还不熟悉，用 Android 来做反而会比较简单

（然而事实上并没有，如果用截图的话至少不用处理变形后的图像）`,
    },
];

for (const work of WORKS) {
    work.desc = parseMarkdown(work.desc);
}
