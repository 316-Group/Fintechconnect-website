import React, { useState, useEffect, useMemo } from 'react';
import {
  motion,
  AnimatePresence,
  useAnimationFrame,
  useMotionValue,
  useTransform,
  useSpring,
  MotionValue,
  animate,
} from 'framer-motion';
import { getPath } from '@/utils/helper';

// --- ASSET CONFIGURATIONS ---
const CAROUSEL_IMAGES = [
  getPath('/products/video/carousel-image-1.png'),
  getPath('/products/video/carousel-image-2.png'),
  getPath('/products/video/carousel-image-3.png'),
  getPath('/products/video/carousel-image-4.png'),
  getPath('/products/video/carousel-image-5.png'),
  getPath('/products/video/carousel-image-6.png'),
];

const MOBILE_SCREENS_SET_1 = [
  getPath('/products/video/sendmobile.png'),
  getPath('/products/video/homemobile.png'),
  getPath('/products/video/sendmobile.png'),
];

const MOBILE_SCREENS_SET_2 = [
  getPath('/products/video/sendmobile2.png'),
  getPath('/products/video/homemobile2.png'),
  getPath('/products/video/cardsmobile2.png'),
];

const WORDS = ['banking', 'fintech', 'wallets', 'Neobanks'];
const NUM_CARDS = 10; 

function useWindowSize() {
  const [size, setSize] = useState({ width: 1200, height: 800 });
  useEffect(() => {
    const handleResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return size;
}

// ==========================================
// MAIN TIMELINE COMPONENT
// ==========================================
export default function VideoSequence() {
  const [scene, setScene] = useState(0);
  const [loopCount, setLoopCount] = useState(0); 
  const MAX_LOOPS = 5;

  useEffect(() => {
    // 🔧 Timeline Updated to include Scene 4 (Split Banner)
    const scene0Duration = 2500;  
    const scene1Duration = 4500;  
    const scene2Duration = 3000;  
    const scene3Duration = 6000;  
    const scene4Duration = 4500;  // Split Banner Scene
    const scene5Duration = 8000;  // Orbit Scene
    const scene6Duration = 4500;  // Text 2
    const scene7Duration = 4000;  // Image Grid
    const scene8Duration = 4500;  // Text 3
    const scene9Duration = 5000;  // Ring & Person
    const scene10Duration = 3000; // Final Logo

    const totalDuration = scene0Duration + scene1Duration + scene2Duration + 
                          scene3Duration + scene4Duration + scene5Duration + 
                          scene6Duration + scene7Duration + scene8Duration + 
                          scene9Duration + scene10Duration;

    const timers = [
      setTimeout(() => setScene(1), scene0Duration),
      setTimeout(() => setScene(2), scene0Duration + scene1Duration),
      setTimeout(() => setScene(3), scene0Duration + scene1Duration + scene2Duration),
      setTimeout(() => setScene(4), scene0Duration + scene1Duration + scene2Duration + scene3Duration),
      setTimeout(() => setScene(5), scene0Duration + scene1Duration + scene2Duration + scene3Duration + scene4Duration),
      setTimeout(() => setScene(6), scene0Duration + scene1Duration + scene2Duration + scene3Duration + scene4Duration + scene5Duration),
      setTimeout(() => setScene(7), scene0Duration + scene1Duration + scene2Duration + scene3Duration + scene4Duration + scene5Duration + scene6Duration),
      setTimeout(() => setScene(8), scene0Duration + scene1Duration + scene2Duration + scene3Duration + scene4Duration + scene5Duration + scene6Duration + scene7Duration),
      setTimeout(() => setScene(9), scene0Duration + scene1Duration + scene2Duration + scene3Duration + scene4Duration + scene5Duration + scene6Duration + scene7Duration + scene8Duration),
      setTimeout(() => setScene(10), scene0Duration + scene1Duration + scene2Duration + scene3Duration + scene4Duration + scene5Duration + scene6Duration + scene7Duration + scene8Duration + scene9Duration),
      
      setTimeout(() => {
        if (loopCount < MAX_LOOPS - 1) {
          setLoopCount(prev => prev + 1);
          setScene(0); 
        }
      }, totalDuration)
    ];

    return () => timers.forEach(clearTimeout);
  }, [loopCount]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white">
      <AnimatePresence mode="sync">
        {scene === 0 && <LogoScene key="logo" />}
        {scene === 1 && <TextScene key="text1" />}
        {scene === 2 && <HeroScene key="hero" />}
        {scene === 3 && <MobileScene key="mobile" />}
        {scene === 4 && <SplitBannerScene key="splitbanner" />} {/* 🔧 NEW SCENE */}
        {scene === 5 && <OrbitScene key="orbit" />}
        {scene === 6 && <TextSceneTwo key="text2" />}
        {scene === 7 && <ImageGridScene key="grid" />}
        {scene === 8 && <TextSceneThree key="text3" />}
        {scene === 9 && <RingPersonScene key="ring" />}
        {scene === 10 && <LogoScene2 key="logo2" />}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// SCENE 1: LOGO
// ==========================================
function LogoScene() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 flex items-center justify-center bg-white z-10"
    >
      <svg width="300" height="150" viewBox="100 0 150 201" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(0.0129111 -0.999917 -0.999917 -0.0129111 353.906 103.367)" fill="#0A63F8"/>
        <path d="M49.302 120.528C45.9887 120.528 42.8654 119.937 39.9321 118.755C36.9987 117.552 34.4874 115.928 32.3982 113.88C30.3089 111.833 28.6629 109.385 27.46 106.537C26.2571 103.666 25.6556 100.606 25.6556 97.3565C25.6556 94.1066 26.2571 91.0572 27.46 88.2082C28.6629 85.3382 30.3089 82.8796 32.3982 80.8326C34.4874 78.7856 36.9987 77.1712 39.9321 75.9894C42.8654 74.8076 45.9887 74.2167 49.302 74.2167C53.4593 74.2167 57.2579 75.1136 60.6978 76.9074C64.1587 78.68 66.9549 81.1386 69.0864 84.283L60.3812 89.6644C59.1572 87.8706 57.5745 86.4566 55.633 85.4226C53.6915 84.3885 51.5811 83.8715 49.302 83.8715C45.5034 83.8715 42.3273 85.1588 39.7738 87.7334C37.2203 90.2869 35.9435 93.4946 35.9435 97.3565C35.9435 101.218 37.2203 104.437 39.7738 107.011C42.3273 109.565 45.5034 110.842 49.302 110.842C51.6022 110.842 53.7126 110.335 55.633 109.322C57.5745 108.288 59.1572 106.874 60.3812 105.08L69.0864 110.462C66.9549 113.606 64.1587 116.075 60.6978 117.869C57.2579 119.642 53.4593 120.528 49.302 120.528ZM89.3773 120.528C84.2914 120.528 80.039 118.871 76.6203 115.558C73.2226 112.245 71.5238 108.13 71.5238 103.213C71.5238 98.2956 73.2226 94.1805 76.6203 90.8672C80.039 87.554 84.2914 85.8974 89.3773 85.8974C92.7327 85.8974 95.7716 86.6571 98.4939 88.1766C101.216 89.6749 103.348 91.7536 104.888 94.4126C106.429 97.0505 107.199 99.9839 107.199 103.213C107.199 106.442 106.429 109.385 104.888 112.044C103.348 114.682 101.216 116.761 98.4939 118.281C95.7716 119.779 92.7327 120.528 89.3773 120.528ZM83.5844 109.037C85.1249 110.599 87.0559 111.38 89.3773 111.38C91.6987 111.38 93.6296 110.599 95.1702 109.037C96.7107 107.476 97.481 105.534 97.481 103.213C97.481 100.891 96.7107 98.9498 95.1702 97.3882C93.6296 95.8265 91.6987 95.0457 89.3773 95.0457C87.0559 95.0457 85.1249 95.8265 83.5844 97.3882C82.0439 98.9498 81.2736 100.891 81.2736 103.213C81.2736 105.534 82.0439 107.476 83.5844 109.037ZM132.302 85.8974C136.1 85.8974 139.16 87.0475 141.482 89.3478C143.803 91.627 144.964 94.6659 144.964 98.4645V119.737H135.499V101.662C135.499 99.6568 134.908 98.0529 133.726 96.8501C132.565 95.6472 131.014 95.0457 129.073 95.0457C127.047 95.0457 125.401 95.6683 124.135 96.9134C122.889 98.1374 122.267 99.7623 122.267 101.788V119.737H112.802V86.6888H122.267V89.9809C124.926 87.2586 128.271 85.8974 132.302 85.8974ZM171.364 85.8974C175.162 85.8974 178.222 87.0475 180.544 89.3478C182.865 91.627 184.026 94.6659 184.026 98.4645V119.737H174.561V101.662C174.561 99.6568 173.97 98.0529 172.788 96.8501C171.628 95.6472 170.077 95.0457 168.135 95.0457C166.109 95.0457 164.463 95.6683 163.197 96.9134C161.952 98.1374 161.329 99.7623 161.329 101.788V119.737H151.864V86.6888H161.329V89.9809C163.988 87.2586 167.333 85.8974 171.364 85.8974ZM223.975 103.339C223.975 104.479 223.911 105.471 223.785 106.315H199.157C199.748 108.172 200.793 109.628 202.291 110.683C203.789 111.738 205.572 112.266 207.641 112.266C209.413 112.266 211.028 111.918 212.484 111.221C213.94 110.525 215.09 109.649 215.934 108.594L222.297 114.102C220.503 116.128 218.319 117.711 215.744 118.85C213.17 119.969 210.384 120.528 207.387 120.528C202.133 120.528 197.743 118.861 194.219 115.527C190.716 112.171 188.964 108.003 188.964 103.023C188.964 99.8362 189.724 96.9345 191.243 94.3176C192.784 91.7008 194.905 89.6433 197.606 88.1449C200.307 86.6466 203.304 85.8974 206.596 85.8974C211.555 85.8974 215.692 87.554 219.005 90.8672C222.318 94.1805 223.975 98.3378 223.975 103.339ZM206.469 94.0644C204.697 94.0644 203.146 94.6025 201.816 95.6788C200.487 96.734 199.579 98.1796 199.094 100.016H213.94C213.412 98.1585 212.484 96.7023 211.154 95.6472C209.825 94.592 208.263 94.0644 206.469 94.0644ZM245.31 120.528C240.224 120.528 235.972 118.871 232.553 115.558C229.155 112.245 227.457 108.13 227.457 103.213C227.457 98.2956 229.155 94.1805 232.553 90.8672C235.972 87.554 240.224 85.8974 245.31 85.8974C248.602 85.8974 251.588 86.636 254.268 88.1133C256.949 89.5694 259.059 91.5742 260.6 94.1277L252.369 99.1292C251.673 97.8841 250.702 96.8923 249.457 96.1536C248.212 95.415 246.83 95.0457 245.31 95.0457C242.989 95.0457 241.058 95.8265 239.517 97.3882C237.977 98.9498 237.206 100.891 237.206 103.213C237.206 105.534 237.977 107.476 239.517 109.037C241.058 110.599 242.989 111.38 245.31 111.38C246.83 111.38 248.212 111.01 249.457 110.272C250.702 109.533 251.673 108.541 252.369 107.296L260.6 112.266C259.059 114.841 256.949 116.867 254.268 118.344C251.588 119.8 248.602 120.528 245.31 120.528ZM285.987 95.299H277.503V107.423C277.503 110.061 278.886 111.38 281.65 111.38C283.022 111.38 284.467 110.989 285.987 110.208V119.104C284.109 120.053 281.998 120.528 279.656 120.528C275.773 120.528 272.861 119.494 270.919 117.426C268.999 115.337 268.038 112.519 268.038 108.974V95.299H263.037V86.6888H268.038V78.4901H277.503V86.6888H285.987V95.299Z" fill="black"/>
        <path d="M3.88977 62.0001V16.6194H30.4375V21.1574H8.42784V35.4199H27.3257V39.958H8.42784V62.0001H3.88977ZM33.1391 29.5853H37.6771V62.0001H33.1391V29.5853ZM35.4405 23.9127C34.7058 23.9127 34.0791 23.675 33.5604 23.1996C33.0634 22.7025 32.8149 22.0867 32.8149 21.3519C32.8149 20.6172 33.0634 20.0121 33.5604 19.5367C34.0791 19.0397 34.7058 18.7912 35.4405 18.7912C36.1536 18.7912 36.7587 19.0397 37.2557 19.5367C37.7744 20.0121 38.0337 20.6172 38.0337 21.3519C38.0337 22.0867 37.7852 22.7025 37.2881 23.1996C36.7911 23.675 36.1752 23.9127 35.4405 23.9127ZM73.6236 41.9353V62.0001H69.0855V42.8429C69.0855 41.0709 68.6533 39.461 67.7889 38.0131C66.9245 36.5653 65.7684 35.4091 64.3206 34.5447C62.8727 33.6803 61.2628 33.2481 59.4908 33.2481C57.7404 33.2481 56.1304 33.6803 54.6609 34.5447C53.2131 35.4091 52.057 36.5653 51.1926 38.0131C50.3282 39.461 49.896 41.0709 49.896 42.8429V62.0001H45.3579V29.5853H49.896V34.0585C51.0413 32.4162 52.5324 31.1088 54.3692 30.1363C56.2061 29.1639 58.205 28.6777 60.366 28.6777C62.8079 28.6777 65.0337 29.2719 67.0434 30.4605C69.0531 31.649 70.6522 33.2481 71.8408 35.2579C73.0293 37.2676 73.6236 39.4934 73.6236 41.9353ZM96.6791 34.1233H88.932L88.8996 62.0001H84.3615L84.3939 34.1233H78.5268V29.5853H84.3939L84.3615 19.407H88.8996L88.932 29.5853H96.6791V34.1233ZM115.84 62.8428C112.858 62.8428 110.135 62.0757 107.671 60.5414C105.229 59.0071 103.274 56.9542 101.804 54.3826C100.356 51.7894 99.6324 48.9261 99.6324 45.7927C99.6324 43.4156 100.054 41.2006 100.897 39.1476C101.739 37.0731 102.895 35.2579 104.365 33.702C105.856 32.1244 107.585 30.8927 109.551 30.0067C111.518 29.1207 113.614 28.6777 115.84 28.6777C118.238 28.6777 120.443 29.1531 122.452 30.1039C124.484 31.0547 126.223 32.3838 127.671 34.0909C129.141 35.7981 130.243 37.797 130.978 40.0877C131.734 42.3783 132.047 44.8526 131.918 47.5107H104.43C104.689 49.5636 105.337 51.4004 106.375 53.0212C107.434 54.6419 108.773 55.9277 110.394 56.8785C112.036 57.8077 113.852 58.2832 115.84 58.3048C118.001 58.3048 119.946 57.7429 121.674 56.6192C123.425 55.4955 124.83 53.9504 125.888 51.9839L130.491 53.0536C129.195 55.9277 127.239 58.2832 124.624 60.12C122.009 61.9352 119.081 62.8428 115.84 62.8428ZM104.3 43.8478H127.347C127.196 41.8381 126.58 40.0012 125.499 38.3373C124.441 36.6517 123.068 35.3119 121.383 34.3178C119.697 33.3022 117.85 32.7943 115.84 32.7943C113.83 32.7943 111.993 33.2914 110.329 34.2854C108.665 35.2579 107.304 36.5869 106.245 38.2724C105.186 39.9364 104.538 41.7948 104.3 43.8478ZM160.302 53.8639L164.354 56.0682C162.884 58.1211 161.015 59.7634 158.746 60.9952C156.498 62.227 154.056 62.8428 151.42 62.8428C148.438 62.8428 145.715 62.0757 143.252 60.5414C140.81 59.0071 138.854 56.9542 137.384 54.3826C135.937 51.7894 135.213 48.9261 135.213 45.7927C135.213 43.4156 135.634 41.2006 136.477 39.1476C137.32 37.0731 138.476 35.2579 139.945 33.702C141.436 32.1244 143.165 30.8927 145.132 30.0067C147.098 29.1207 149.194 28.6777 151.42 28.6777C154.056 28.6777 156.498 29.2935 158.746 30.5253C161.015 31.7571 162.884 33.4102 164.354 35.4848L160.302 37.6566C159.178 36.2303 157.827 35.139 156.25 34.3827C154.672 33.6047 153.062 33.2157 151.42 33.2157C149.237 33.2157 147.26 33.7992 145.488 34.9661C143.716 36.1115 142.312 37.6349 141.274 39.5366C140.259 41.4383 139.751 43.5236 139.751 45.7927C139.751 48.0617 140.269 50.1471 141.307 52.0487C142.366 53.9504 143.781 55.4739 145.553 56.6192C147.325 57.7429 149.281 58.3048 151.42 58.3048C153.192 58.3048 154.856 57.8942 156.412 57.073C157.968 56.2518 159.264 55.1822 160.302 53.8639ZM198.028 41.9353V62.0001H193.49V42.8429C193.49 41.0709 193.058 39.461 192.193 38.0131C191.329 36.5653 190.173 35.4091 188.725 34.5447C187.277 33.6803 185.667 33.2481 183.895 33.2481C182.145 33.2481 180.535 33.6803 179.065 34.5447C177.617 35.4091 176.461 36.5653 175.597 38.0131C174.733 39.461 174.3 41.0709 174.3 42.8429V62.0001H169.762V13.3779H174.3V34.0585C175.446 32.4162 176.937 31.1088 178.774 30.1363C180.61 29.1639 182.609 28.6777 184.77 28.6777C187.212 28.6777 189.438 29.2719 191.448 30.4605C193.458 31.649 195.057 33.2481 196.245 35.2579C197.434 37.2676 198.028 39.4934 198.028 41.9353Z" fill="black"/>
        <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(-0.999793 -0.0203619 -0.0203619 0.999793 253.736 21.9693)" fill="#0A63F8"/>
        <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(-0.849868 -0.526995 -0.526995 0.849868 302.125 28.4821)" fill="#0A63F8"/>
        <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(-0.480664 -0.876905 -0.876905 0.480664 337.863 59.1159)" fill="#0A63F8"/>
        <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(0.503146 -0.864202 -0.864202 -0.503146 346.105 149.786)" fill="#0A63F8"/>
        <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(0.721529 -0.692385 -0.692385 -0.721529 324.629 178.293)" fill="#0A63F8"/>
        <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(0.900044 -0.435799 -0.435799 -0.900044 288.037 194.412)" fill="#0A63F8"/>
        <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(0.999533 -0.0305672 -0.0305672 -0.999533 248.223 200.014)" fill="#0A63F8"/>
      </svg> 
    </motion.div>
  );
}

// ==========================================
// SCENE 2: TEXT TRANSITION 1
// ==========================================
function TextScene() {
  const [textIndex, setTextIndex] = useState(0);
  const texts = ["Smarter Building", "one Component at a time."];

  useEffect(() => {
    const timer = setTimeout(() => setTextIndex(1), 1500);
    return () => clearTimeout(timer);
  }, []);

  const isSecond = textIndex === 1;
  const words = texts[textIndex].split(" ");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 flex items-center justify-center bg-white z-10"
    >
      <AnimatePresence mode="wait">
        <motion.h1
          key={textIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight text-center px-4 flex flex-wrap justify-center gap-x-[0.3em] gap-y-2"
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
              className={`inline-block ${isSecond ? 'font-serif text-[#1c3d7a]' : 'text-[#1a1f36]'}`}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>
      </AnimatePresence>
    </motion.div>
  );
}

// ==========================================
// SCENE 3: HERO VIDEO WITH CARDS
// ==========================================
function HeroScene() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 bg-[#f4f5f7] z-10 overflow-hidden flex items-center justify-center"
    >
      <motion.div
        className="relative w-[90%] h-[85%] md:w-[75%] md:h-[90%] max-w-7xl rounded-[2rem] shadow-2xl overflow-hidden z-0"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.0, ease: "easeOut" }}
      >
        {/* 🔧 CHANGED: Replaced <img> with <video> */}
        <video
          src={getPath('/products/video/africanwomanvideo.mp4')} // 🔧 REPLACE WITH YOUR VIDEO PATH
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />

        <motion.img
          src={getPath('/products/video/floatingcard1.png')}
          alt="Card 1"
          className="absolute top-6 left-6 md:top-12 md:left-12 w-[160px] md:w-[290px] rounded-2xl"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
        />

        <motion.img
          src={getPath('/products/video/floatingcard2.png')}
          alt="Card 2"
          className="absolute bottom-6 right-6 md:bottom-12 md:right-12 w-[160px] md:w-[290px] rounded-2xl"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.3, duration: 0.8, ease: "easeOut" }}
        />
      </motion.div>
    </motion.div>
  );
}

// ==========================================
// SCENE 4: MOBILE SCREENS
// ==========================================
function MobileScene() {
  const [setIndex, setSetIndex] = useState(0);
  const screens = setIndex === 0 ? MOBILE_SCREENS_SET_1 : MOBILE_SCREENS_SET_2;

  useEffect(() => {
    const timer = setTimeout(() => setSetIndex(1), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 flex items-center justify-center bg-[#e8f1f8] overflow-hidden z-10"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={setIndex}
          className="flex items-center justify-center w-full max-w-7xl px-4 gap-4 md:gap-8 lg:gap-16"
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50, transition: { duration: 0.3 } }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="z-0 scale-90 opacity-90"
          >
            <PhonePlaceholder src={screens[0]} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30, transition: { duration: 0.3 } }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            className="z-10 scale-105 md:scale-110"
          >
            <PhonePlaceholder src={screens[1]} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50, transition: { duration: 0.3 } }}
            transition={{ duration: 0.6, delay: 0.9, ease: "easeOut" }}
            className="z-0 scale-90 opacity-90"
          >
            <PhonePlaceholder src={screens[2]} />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function PhonePlaceholder({ src }: { src: string }) {
  return (
    <div className="relative w-[180px] h-[380px] md:w-[240px] md:h-[500px] lg:w-[260px] lg:h-[540px] bg-gray-900 rounded-[2.5rem] md:rounded-[3rem] p-1.5 md:p-2 shadow-2xl">
      <div className="relative w-full h-full bg-white rounded-[2rem] md:rounded-[2.5rem] overflow-hidden">
        
        <div className="absolute top-0 w-full flex justify-between items-center px-4 pt-3 pb-2 z-10 bg-white/90 backdrop-blur-sm">
          <span className="text-[10px] md:text-xs font-semibold text-gray-800">9:41</span>
          <div className="flex gap-1 items-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-gray-800">
              <path d="M2 22h20V2L2 22zm18-2H6.83L20 6.83V20z"/>
            </svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-gray-800">
              <path d="M12 21a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm-4.24-4.24a6 6 0 0 1 8.48 0l-1.41 1.41a4 4 0 0 0-5.66 0l-1.41-1.41zM4.93 13.66a10 10 0 0 1 14.14 0l-1.41 1.41a8 8 0 0 0-11.32 0l-1.41-1.41z"/>
            </svg>
            <svg width="16" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-gray-800">
              <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/>
            </svg>
          </div>
        </div>

        <div className="w-full h-full pt-8 bg-white">
          <img src={src} alt="Mobile Screen" className="w-full h-full object-cover" />
        </div>

      </div>
    </div>
  );
}

// ==========================================
// SCENE 5: SPLIT BANNER (NEW)
// ==========================================

// Custom Counter for decimals
function AnimatedDecimal({ value, delay = 0, duration = 2 }: { value: number, delay?: number, duration?: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => latest.toFixed(1));

  useEffect(() => {
    const controls = animate(count, value, { duration, delay, ease: "easeOut" });
    return controls.stop;
  }, [value, delay, duration, count]);

  return <motion.span>{rounded}</motion.span>;
}

function SplitBannerScene() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 bg-[#f4f5f7] z-10 flex items-center justify-center"
    >
      {/* The 85% Rounded Box */}
      <div className="relative w-[85%] h-[90%] rounded-[2rem] md:rounded-[3rem] overflow-hidden flex flex-col bg-white">
        
        {/* 🔧 NEW: Background Image for the bottom section */}
        <div className="absolute bottom-0 left-0 w-full h-[60%] z-0">
          <img
            src={getPath('/products/video/cafebackground.png')} // 🔧 REPLACE WITH YOUR BACKGROUND IMAGE
            alt="Background"
            className="w-full h-full object-cover opacity-90"
          />
        </div>

        {/* Top Banner */}
        {/* 🔧 CHANGED: Added z-10 so it covers the top part of the background image */}
        <div className="relative w-full h-[40%] bg-blue-500 flex flex-col justify-center px-8 md:px-24 z-10">
          <div className="flex items-baseline justify-between w-full max-w-7xl mx-auto">
            <motion.h1
               initial={{ opacity: 0, x: -50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.3, duration: 0.8 }}
               className="text-5xl md:text-[8rem] lg:text-[10rem] font-sans font-light tracking-tighter text-white leading-none"
            >
              BUILD
            </motion.h1>
            
            <motion.div
               initial={{ opacity: 0, x: 50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.3, duration: 0.8 }}
               className="flex flex-col items-end"
            >
              <div className="text-5xl md:text-[10rem] lg:text-[12rem] font-sans font-light tracking-tighter text-white leading-none flex items-baseline">
                 <AnimatedDecimal value={5.5} delay={0.5} duration={2} />
              </div>
              <div className="text-xl md:text-2xl lg:text-3xl font-sans text-white/90 mt-2 text-right">
                Times Faster With <span className="font-bold">FintecConnect.</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Foreground Image */}
        <motion.img
          src={getPath('/products/video/mansmilingimage.png')} 
          alt="Man looking at phone"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[75%] md:h-[90%] object-contain z-20 pointer-events-none"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
        />
        
      </div>
    </motion.div>
  );
}

// ==========================================
// SCENE 6: ORBIT CAROUSEL
// ==========================================
function OrbitScene() {
  const { width, height } = useWindowSize();
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % WORDS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const time = useMotionValue(0);
  useAnimationFrame((t) => {
    time.set(t);
  });

  const radiusX = Math.min(width * 0.40, 600);
  const radiusY = Math.min(height * 0.30, 250);

  const cards = useMemo(() => {
    return Array.from({ length: NUM_CARDS }).map((_, i) => ({
      id: i,
      imageUrl: CAROUSEL_IMAGES[i % CAROUSEL_IMAGES.length],
    }));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 w-full h-full bg-[#f4f5f7] overflow-hidden flex items-center justify-center z-10"
    >
      <div className="absolute inset-0 bg-radial-gradient from-white to-transparent opacity-50 pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        {cards.map((card, index) => (
          <OrbitingCard
            key={card.id}
            index={index}
            total={NUM_CARDS}
            time={time}
            radiusX={radiusX}
            radiusY={radiusY}
            cardData={card}
          />
        ))}
      </div>
      <div className="relative z-50 text-center px-4">
        <div className="absolute inset-0 bg-white/70 blur-3xl rounded-full scale-[1.9] pointer-events-none -z-10" />
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-medium text-[#1a1f36] tracking-tight">
          enhancing the
          <br />
          <span className="relative inline-block min-w-[200px] md:min-w-[300px] h-[1.2em] my-2">
            <AnimatePresence mode="wait">
              <motion.span
                key={WORDS[wordIndex]}
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="absolute inset-0 flex items-center justify-center font-serif text-[#1c3d7a]"
              >
                {WORDS[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
          <br />
          experience.
        </h1>
      </div>
    </motion.div>
  );
}

const OrbitingCard = React.memo(function OrbitingCard({
  index,
  total,
  time,
  radiusX,
  radiusY,
  cardData,
}: {
  index: number;
  total: number;
  time: MotionValue<number>;
  radiusX: number;
  radiusY: number;
  cardData: { imageUrl: string };
}) {
  const angleOffset = (index / total) * Math.PI * 2;
  const speed = 0.0003;
  const tilt = -15 * (Math.PI / 180);

  const x = useTransform(time, (t) => {
    const theta = t * speed + angleOffset;
    const baseX = Math.cos(theta) * radiusX;
    const baseY = Math.sin(theta) * radiusY;
    return baseX * Math.cos(tilt) - baseY * Math.sin(tilt);
  });

  const y = useTransform(time, (t) => {
    const theta = t * speed + angleOffset;
    const baseX = Math.cos(theta) * radiusX;
    const baseY = Math.sin(theta) * radiusY;
    return baseX * Math.sin(tilt) + baseY * Math.cos(tilt);
  });

  const scale = useTransform(time, (t) => {
    const theta = t * speed + angleOffset;
    return 0.6 + 0.35 * ((Math.sin(theta) + 1) / 2);
  });

  const filter = useTransform(time, (t) => {
    const theta = t * speed + angleOffset;
    const blurAmount = Math.max(0, (1 - Math.sin(theta)) * 1.5);
    return `blur(${blurAmount}px)`;
  });

  const opacity = useTransform(time, (t) => {
    const theta = t * speed + angleOffset;
    return 0.5 + 0.5 * ((Math.sin(theta) + 1) / 2);
  });

  const zIndex = useTransform(time, (t) => {
    const theta = t * speed + angleOffset;
    return Math.floor((Math.sin(theta) + 1) * 50);
  });

  return (
    <motion.div
      style={{
        x,
        y,
        scale,
        opacity,
        filter,
        zIndex,
        position: 'absolute',
        willChange: 'transform, opacity, filter',
      }}
      className="w-48 h-64 md:w-64 md:h-80 lg:w-72 lg:h-96 rounded-xl shadow-2xl overflow-hidden bg-white border border-gray-100 p-2"
    >
      <img
        src={cardData.imageUrl}
        alt={`Orbiting card ${index}`}
        className="w-full h-full object-cover rounded-lg"
        draggable={false}
      />
    </motion.div>
  );
});

// ==========================================
// SCENE 7: TEXT TRANSITION 2
// ==========================================
function TextSceneTwo() {
  const [textIndex, setTextIndex] = useState(0);
  const texts = ["from sandbox to product", "a better financial experience"];

  useEffect(() => {
    const timer = setTimeout(() => setTextIndex(1), 2000);
    return () => clearTimeout(timer);
  }, []);

  const isSecond = textIndex === 1;
  const words = texts[textIndex].split(" ");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 flex items-center justify-center bg-white z-10"
    >
      <AnimatePresence mode="wait">
        <motion.h1
          key={textIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight text-center px-4 flex flex-wrap justify-center gap-x-[0.3em] gap-y-2"
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
              className={`inline-block ${isSecond ? 'font-serif text-[#1c3d7a]' : 'text-[#1a1f36]'}`}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>
      </AnimatePresence>
    </motion.div>
  );
}

// ==========================================
// SCENE 8: IMAGE CAROUSEL
// A flat, continuously drifting row of images.
// ==========================================
 
const MIN_SLOTS = 12; 
const SPEED = 0.00025; 
 
function ImageGridScene() {
  const progress = useMotionValue(0);
 
  useAnimationFrame((_, delta) => {
    progress.set(progress.get() + Math.min(delta, 50) * SPEED);
  });
 
  const total = CAROUSEL_IMAGES.length;
  const slots = Math.ceil(MIN_SLOTS / total) * total;
 
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden bg-slate-100"
    >
      {/* Width variables dictate the image size */}
      <div className="relative flex h-full w-full items-center justify-center [--w:200px] sm:[--w:260px] md:[--w:320px] lg:[--w:650px]">
        {Array.from({ length: slots }, (_, index) => (
          <CarouselItem
            key={index}
            index={index}
            slots={slots}
            progress={progress}
            img={CAROUSEL_IMAGES[index % total]}
          />
        ))}
      </div>
 
      {/* Soft fade on both edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-100 to-transparent md:w-48" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-100 to-transparent md:w-48" />
    </motion.div>
  );
}
 
function CarouselItem({
  index,
  slots,
  progress,
  img,
}: {
  index: number;
  slots: number;
  progress: MotionValue<number>;
  img: string;
}) {
  const offset = useTransform(progress, (p) => {
    let o = (((index - p) % slots) + slots) % slots;
    if (o > slots / 2) o -= slots;
    return o;
  });
 
  // Spacing derived from the image width + a 32px gap
  const x = useTransform(offset, (o) => `calc(${o} * (var(--w) + 32px))`);
 
  // Scale down slightly towards the edges
  const scale = useTransform(offset, (o) => Math.max(0.85, 1.0 - Math.abs(o) * 0.05));
 
  // Fade out images at the far edges
  const opacity = useTransform(offset, (o) => Math.min(1, Math.max(0, (4.5 - Math.abs(o)) / 1.5)));
 
  return (
    // 🔧 CHANGED: Removed the card wrapper and applied styles directly to the image
    <motion.img
      src={img}
      alt={`Carousel image ${(index % CAROUSEL_IMAGES.length) + 1}`}
      draggable={false}
      className="absolute w-[var(--w)] h-auto max-h-[85vh] object-cover select-none will-change-transform rounded-2xl shadow-xl"
      style={{
        x,
        scale,
        opacity,
      }}
    />
  );
}

// ==========================================
// SCENE 9: TEXT TRANSITION 3
// ==========================================
function TextSceneThree() {
  const [textIndex, setTextIndex] = useState(0);
  const texts = ["turn financial friction", "into a simpler experience"];

  useEffect(() => {
    const timer = setTimeout(() => setTextIndex(1), 2000);
    return () => clearTimeout(timer);
  }, []);

  const isSecond = textIndex === 1;
  const words = texts[textIndex].split(" ");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 flex items-center justify-center bg-white z-10"
    >
      <AnimatePresence mode="wait">
        <motion.h1
          key={textIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight text-center px-4 flex flex-wrap justify-center gap-x-[0.3em] gap-y-2"
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
              className={`inline-block ${isSecond ? 'font-serif text-[#1c3d7a]' : 'text-[#1a1f36]'}`}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>
      </AnimatePresence>
    </motion.div>
  );
}

// ==========================================
// SCENE 10: RING & PERSON
// ==========================================
function Counter({ value, delay = 0, duration = 2 }: { value: number, delay?: number, duration?: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => `+$${Math.round(latest).toLocaleString()}`);

  useEffect(() => {
    const controls = animate(count, value, { duration, delay, ease: "easeOut" });
    return controls.stop;
  }, [value, delay, duration, count]);

  return <motion.span className="font-semibold text-[#1a1f36]">{rounded}</motion.span>;
}

function RingPersonScene() {
  const textItems = ["pay", "send", "monitor"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 flex items-center justify-center bg-white z-10 overflow-hidden"
    >
      <div className="flex flex-row items-center justify-center w-full max-w-6xl px-8 gap-12 lg:gap-24">
        
        {/* Left Side: Person & Ring */}
        <div className="relative w-[300px] h-[500px] md:w-[500px] md:h-[800px] flex items-center justify-center">
          
          <img
            src={getPath('/products/video/womanphoneimage.png')}
            alt="Person looking at phone"
            className="relative z-10 w-full h-full object-contain"
          />

          <svg
            viewBox="0 0 400 400"
            className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[360px] md:h-[360px] z-20 pointer-events-none"
          >
            <circle
              cx="200"
              cy="200"
              r="160"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="18"
            />
            
            <motion.circle
              cx="200"
              cy="200"
              r="160"
              fill="none"
              stroke="#1c3d7a"
              strokeWidth="18"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 0.7 }}
              transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
              style={{ rotate: 90, transformOrigin: "center" }}
            />
          </svg>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="absolute top-[45%] -left-8 bg-white rounded-full px-4 py-2 shadow-xl flex items-center gap-2 border border-gray-100 z-30"
          >
            <img src="https://i.pravatar.cc/100?img=1" alt="avatar" className="w-8 h-8 rounded-full" />
            <Counter value={800} delay={0.5} duration={2} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="absolute bottom-[15%] -right-8 bg-white rounded-full px-4 py-2 shadow-xl flex items-center gap-2 border border-gray-100 z-30"
          >
            <img src="https://i.pravatar.cc/100?img=2" alt="avatar" className="w-8 h-8 rounded-full" />
            <Counter value={150} delay={0.5} duration={2} />
          </motion.div>
        </div>

        {/* Right Side: Text Stack */}
        <div className="flex flex-col gap-2">
          {textItems.map((text, i) => (
            <motion.h2
              key={text}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.4, duration: 0.6, ease: "easeOut" }}
              className="text-6xl md:text-7xl lg:text-8xl font-serif text-[#1c3d7a] tracking-tight capitalize"
            >
              {text}
            </motion.h2>
          ))}
        </div>

      </div>
    </motion.div>
  );
}

// ==========================================
// SCENE 11: LOGO 2
// ==========================================
function LogoScene2() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 flex items-center justify-center bg-white z-10"
    >
      <svg width="300" height="150" viewBox="100 0 150 201" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(0.0129111 -0.999917 -0.999917 -0.0129111 353.906 103.367)" fill="#0A63F8"/>
        <path d="M49.302 120.528C45.9887 120.528 42.8654 119.937 39.9321 118.755C36.9987 117.552 34.4874 115.928 32.3982 113.88C30.3089 111.833 28.6629 109.385 27.46 106.537C26.2571 103.666 25.6556 100.606 25.6556 97.3565C25.6556 94.1066 26.2571 91.0572 27.46 88.2082C28.6629 85.3382 30.3089 82.8796 32.3982 80.8326C34.4874 78.7856 36.9987 77.1712 39.9321 75.9894C42.8654 74.8076 45.9887 74.2167 49.302 74.2167C53.4593 74.2167 57.2579 75.1136 60.6978 76.9074C64.1587 78.68 66.9549 81.1386 69.0864 84.283L60.3812 89.6644C59.1572 87.8706 57.5745 86.4566 55.633 85.4226C53.6915 84.3885 51.5811 83.8715 49.302 83.8715C45.5034 83.8715 42.3273 85.1588 39.7738 87.7334C37.2203 90.2869 35.9435 93.4946 35.9435 97.3565C35.9435 101.218 37.2203 104.437 39.7738 107.011C42.3273 109.565 45.5034 110.842 49.302 110.842C51.6022 110.842 53.7126 110.335 55.633 109.322C57.5745 108.288 59.1572 106.874 60.3812 105.08L69.0864 110.462C66.9549 113.606 64.1587 116.075 60.6978 117.869C57.2579 119.642 53.4593 120.528 49.302 120.528ZM89.3773 120.528C84.2914 120.528 80.039 118.871 76.6203 115.558C73.2226 112.245 71.5238 108.13 71.5238 103.213C71.5238 98.2956 73.2226 94.1805 76.6203 90.8672C80.039 87.554 84.2914 85.8974 89.3773 85.8974C92.7327 85.8974 95.7716 86.6571 98.4939 88.1766C101.216 89.6749 103.348 91.7536 104.888 94.4126C106.429 97.0505 107.199 99.9839 107.199 103.213C107.199 106.442 106.429 109.385 104.888 112.044C103.348 114.682 101.216 116.761 98.4939 118.281C95.7716 119.779 92.7327 120.528 89.3773 120.528ZM83.5844 109.037C85.1249 110.599 87.0559 111.38 89.3773 111.38C91.6987 111.38 93.6296 110.599 95.1702 109.037C96.7107 107.476 97.481 105.534 97.481 103.213C97.481 100.891 96.7107 98.9498 95.1702 97.3882C93.6296 95.8265 91.6987 95.0457 89.3773 95.0457C87.0559 95.0457 85.1249 95.8265 83.5844 97.3882C82.0439 98.9498 81.2736 100.891 81.2736 103.213C81.2736 105.534 82.0439 107.476 83.5844 109.037ZM132.302 85.8974C136.1 85.8974 139.16 87.0475 141.482 89.3478C143.803 91.627 144.964 94.6659 144.964 98.4645V119.737H135.499V101.662C135.499 99.6568 134.908 98.0529 133.726 96.8501C132.565 95.6472 131.014 95.0457 129.073 95.0457C127.047 95.0457 125.401 95.6683 124.135 96.9134C122.889 98.1374 122.267 99.7623 122.267 101.788V119.737H112.802V86.6888H122.267V89.9809C124.926 87.2586 128.271 85.8974 132.302 85.8974ZM171.364 85.8974C175.162 85.8974 178.222 87.0475 180.544 89.3478C182.865 91.627 184.026 94.6659 184.026 98.4645V119.737H174.561V101.662C174.561 99.6568 173.97 98.0529 172.788 96.8501C171.628 95.6472 170.077 95.0457 168.135 95.0457C166.109 95.0457 164.463 95.6683 163.197 96.9134C161.952 98.1374 161.329 99.7623 161.329 101.788V119.737H151.864V86.6888H161.329V89.9809C163.988 87.2586 167.333 85.8974 171.364 85.8974ZM223.975 103.339C223.975 104.479 223.911 105.471 223.785 106.315H199.157C199.748 108.172 200.793 109.628 202.291 110.683C203.789 111.738 205.572 112.266 207.641 112.266C209.413 112.266 211.028 111.918 212.484 111.221C213.94 110.525 215.09 109.649 215.934 108.594L222.297 114.102C220.503 116.128 218.319 117.711 215.744 118.85C213.17 119.969 210.384 120.528 207.387 120.528C202.133 120.528 197.743 118.861 194.219 115.527C190.716 112.171 188.964 108.003 188.964 103.023C188.964 99.8362 189.724 96.9345 191.243 94.3176C192.784 91.7008 194.905 89.6433 197.606 88.1449C200.307 86.6466 203.304 85.8974 206.596 85.8974C211.555 85.8974 215.692 87.554 219.005 90.8672C222.318 94.1805 223.975 98.3378 223.975 103.339ZM206.469 94.0644C204.697 94.0644 203.146 94.6025 201.816 95.6788C200.487 96.734 199.579 98.1796 199.094 100.016H213.94C213.412 98.1585 212.484 96.7023 211.154 95.6472C209.825 94.592 208.263 94.0644 206.469 94.0644ZM245.31 120.528C240.224 120.528 235.972 118.871 232.553 115.558C229.155 112.245 227.457 108.13 227.457 103.213C227.457 98.2956 229.155 94.1805 232.553 90.8672C235.972 87.554 240.224 85.8974 245.31 85.8974C248.602 85.8974 251.588 86.636 254.268 88.1133C256.949 89.5694 259.059 91.5742 260.6 94.1277L252.369 99.1292C251.673 97.8841 250.702 96.8923 249.457 96.1536C248.212 95.415 246.83 95.0457 245.31 95.0457C242.989 95.0457 241.058 95.8265 239.517 97.3882C237.977 98.9498 237.206 100.891 237.206 103.213C237.206 105.534 237.977 107.476 239.517 109.037C241.058 110.599 242.989 111.38 245.31 111.38C246.83 111.38 248.212 111.01 249.457 110.272C250.702 109.533 251.673 108.541 252.369 107.296L260.6 112.266C259.059 114.841 256.949 116.867 254.268 118.344C251.588 119.8 248.602 120.528 245.31 120.528ZM285.987 95.299H277.503V107.423C277.503 110.061 278.886 111.38 281.65 111.38C283.022 111.38 284.467 110.989 285.987 110.208V119.104C284.109 120.053 281.998 120.528 279.656 120.528C275.773 120.528 272.861 119.494 270.919 117.426C268.999 115.337 268.038 112.519 268.038 108.974V95.299H263.037V86.6888H268.038V78.4901H277.503V86.6888H285.987V95.299Z" fill="black"/>
        <path d="M3.88977 62.0001V16.6194H30.4375V21.1574H8.42784V35.4199H27.3257V39.958H8.42784V62.0001H3.88977ZM33.1391 29.5853H37.6771V62.0001H33.1391V29.5853ZM35.4405 23.9127C34.7058 23.9127 34.0791 23.675 33.5604 23.1996C33.0634 22.7025 32.8149 22.0867 32.8149 21.3519C32.8149 20.6172 33.0634 20.0121 33.5604 19.5367C34.0791 19.0397 34.7058 18.7912 35.4405 18.7912C36.1536 18.7912 36.7587 19.0397 37.2557 19.5367C37.7744 20.0121 38.0337 20.6172 38.0337 21.3519C38.0337 22.0867 37.7852 22.7025 37.2881 23.1996C36.7911 23.675 36.1752 23.9127 35.4405 23.9127ZM73.6236 41.9353V62.0001H69.0855V42.8429C69.0855 41.0709 68.6533 39.461 67.7889 38.0131C66.9245 36.5653 65.7684 35.4091 64.3206 34.5447C62.8727 33.6803 61.2628 33.2481 59.4908 33.2481C57.7404 33.2481 56.1304 33.6803 54.6609 34.5447C53.2131 35.4091 52.057 36.5653 51.1926 38.0131C50.3282 39.461 49.896 41.0709 49.896 42.8429V62.0001H45.3579V29.5853H49.896V34.0585C51.0413 32.4162 52.5324 31.1088 54.3692 30.1363C56.2061 29.1639 58.205 28.6777 60.366 28.6777C62.8079 28.6777 65.0337 29.2719 67.0434 30.4605C69.0531 31.649 70.6522 33.2481 71.8408 35.2579C73.0293 37.2676 73.6236 39.4934 73.6236 41.9353ZM96.6791 34.1233H88.932L88.8996 62.0001H84.3615L84.3939 34.1233H78.5268V29.5853H84.3939L84.3615 19.407H88.8996L88.932 29.5853H96.6791V34.1233ZM115.84 62.8428C112.858 62.8428 110.135 62.0757 107.671 60.5414C105.229 59.0071 103.274 56.9542 101.804 54.3826C100.356 51.7894 99.6324 48.9261 99.6324 45.7927C99.6324 43.4156 100.054 41.2006 100.897 39.1476C101.739 37.0731 102.895 35.2579 104.365 33.702C105.856 32.1244 107.585 30.8927 109.551 30.0067C111.518 29.1207 113.614 28.6777 115.84 28.6777C118.238 28.6777 120.443 29.1531 122.452 30.1039C124.484 31.0547 126.223 32.3838 127.671 34.0909C129.141 35.7981 130.243 37.797 130.978 40.0877C131.734 42.3783 132.047 44.8526 131.918 47.5107H104.43C104.689 49.5636 105.337 51.4004 106.375 53.0212C107.434 54.6419 108.773 55.9277 110.394 56.8785C112.036 57.8077 113.852 58.2832 115.84 58.3048C118.001 58.3048 119.946 57.7429 121.674 56.6192C123.425 55.4955 124.83 53.9504 125.888 51.9839L130.491 53.0536C129.195 55.9277 127.239 58.2832 124.624 60.12C122.009 61.9352 119.081 62.8428 115.84 62.8428ZM104.3 43.8478H127.347C127.196 41.8381 126.58 40.0012 125.499 38.3373C124.441 36.6517 123.068 35.3119 121.383 34.3178C119.697 33.3022 117.85 32.7943 115.84 32.7943C113.83 32.7943 111.993 33.2914 110.329 34.2854C108.665 35.2579 107.304 36.5869 106.245 38.2724C105.186 39.9364 104.538 41.7948 104.3 43.8478ZM160.302 53.8639L164.354 56.0682C162.884 58.1211 161.015 59.7634 158.746 60.9952C156.498 62.227 154.056 62.8428 151.42 62.8428C148.438 62.8428 145.715 62.0757 143.252 60.5414C140.81 59.0071 138.854 56.9542 137.384 54.3826C135.937 51.7894 135.213 48.9261 135.213 45.7927C135.213 43.4156 135.634 41.2006 136.477 39.1476C137.32 37.0731 138.476 35.2579 139.945 33.702C141.436 32.1244 143.165 30.8927 145.132 30.0067C147.098 29.1207 149.194 28.6777 151.42 28.6777C154.056 28.6777 156.498 29.2935 158.746 30.5253C161.015 31.7571 162.884 33.4102 164.354 35.4848L160.302 37.6566C159.178 36.2303 157.827 35.139 156.25 34.3827C154.672 33.6047 153.062 33.2157 151.42 33.2157C149.237 33.2157 147.26 33.7992 145.488 34.9661C143.716 36.1115 142.312 37.6349 141.274 39.5366C140.259 41.4383 139.751 43.5236 139.751 45.7927C139.751 48.0617 140.269 50.1471 141.307 52.0487C142.366 53.9504 143.781 55.4739 145.553 56.6192C147.325 57.7429 149.281 58.3048 151.42 58.3048C153.192 58.3048 154.856 57.8942 156.412 57.073C157.968 56.2518 159.264 55.1822 160.302 53.8639ZM198.028 41.9353V62.0001H193.49V42.8429C193.49 41.0709 193.058 39.461 192.193 38.0131C191.329 36.5653 190.173 35.4091 188.725 34.5447C187.277 33.6803 185.667 33.2481 183.895 33.2481C182.145 33.2481 180.535 33.6803 179.065 34.5447C177.617 35.4091 176.461 36.5653 175.597 38.0131C174.733 39.461 174.3 41.0709 174.3 42.8429V62.0001H169.762V13.3779H174.3V34.0585C175.446 32.4162 176.937 31.1088 178.774 30.1363C180.61 29.1639 182.609 28.6777 184.77 28.6777C187.212 28.6777 189.438 29.2719 191.448 30.4605C193.458 31.649 195.057 33.2481 196.245 35.2579C197.434 37.2676 198.028 39.4934 198.028 41.9353Z" fill="black"/>
        <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(-0.999793 -0.0203619 -0.0203619 0.999793 253.736 21.9693)" fill="#0A63F8"/>
        <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(-0.849868 -0.526995 -0.526995 0.849868 302.125 28.4821)" fill="#0A63F8"/>
        <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(-0.480664 -0.876905 -0.876905 0.480664 337.863 59.1159)" fill="#0A63F8"/>
        <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(0.503146 -0.864202 -0.864202 -0.503146 346.105 149.786)" fill="#0A63F8"/>
        <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(0.721529 -0.692385 -0.692385 -0.721529 324.629 178.293)" fill="#0A63F8"/>
        <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(0.900044 -0.435799 -0.435799 -0.900044 288.037 194.412)" fill="#0A63F8"/>
        <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(0.999533 -0.0305672 -0.0305672 -0.999533 248.223 200.014)" fill="#0A63F8"/>
      </svg>      
    </motion.div>
  );
}