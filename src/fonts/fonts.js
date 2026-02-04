import localFont from "next/font/local";

export const programme = localFont({
  src: "../fonts/Programme-Light.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
});

export const pxGrotesk = localFont({
  src: '../fonts/Px-Grotesk-Regular.woff2', // 경로 확인 (src 내부에서 접근)
  weight: '400',
  style: 'normal',
  display: 'swap',
});

export const pretendardB = localFont({
  src: '../fonts/Pretendard-Bold.subset.woff', // 경로 확인 (src 내부에서 접근)
  weight: '400',
  style: 'normal',
  display: 'swap',
});

export const pretendardR = localFont({
  src: '../../public/fonts/PretendardVariable.ttf',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
});

export const neuehaas = localFont({
  src: '../fonts/NeueHaasGrotText-55Roman-Web.woff2', // 경로 확인 (src 내부에서 접근)
  weight: '400',
  style: 'normal',
  display: 'swap',
});