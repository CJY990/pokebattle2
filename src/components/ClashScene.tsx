import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Card } from '../types';

interface ClashSceneProps {
    playerCard: Card;
    opponentCard: Card;
    playerHp: number;
    playerMaxHp: number; // For percentage calc
    opponentHp: number;
    opponentMaxHp: number;
    onComplete: () => void;
}

const ClashScene: React.FC<ClashSceneProps> = ({
    playerCard,
    opponentCard,
    playerHp,
    playerMaxHp = 100, // Default assume 100 if not passed, but better passed
    opponentHp,
    opponentMaxHp = 100,
    onComplete
}) => {
    // 애니메이션 단계 관리
    // 0: 등장, 1: 충돌/데미지 표시, 2: 종료 대기
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        // 1초 뒤 충돌/데미지 페이즈
        const t1 = setTimeout(() => setPhase(1), 800);
        // 4초 뒤 종료 콜백
        const t2 = setTimeout(() => onComplete(), 4000);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[100] bg-[#23220f] font-sans overflow-hidden flex flex-col">
            {/* Styles defined locally for specific 3d transforms */}
            <style>{`
                .clash-perspective {
                    perspective: 800px;
                }
                .card-left {
                    transform: rotate3d(1, -0.5, 0, 15deg) scale(1.05);
                    box-shadow: 0 0 30px rgba(249, 245, 6, 0.3);
                    z-index: 20;
                }
                .card-right {
                    transform: rotate3d(1, 0.5, 0, 15deg) scale(0.95);
                    filter: brightness(0.8);
                    z-index: 10;
                }
                 /* Animation Keyframes for entry */
                @keyframes slideInLeft {
                    from { transform: translateX(-100%) rotate3d(0, 1, 0, 60deg); opacity: 0; }
                    to { transform: rotate3d(1, -0.5, 0, 15deg) scale(1.05); opacity: 1; }
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%) rotate3d(0, -1, 0, 60deg); opacity: 0; }
                    to { transform: rotate3d(1, 0.5, 0, 15deg) scale(0.95); opacity: 1; }
                }
                .animate-slide-in-left {
                    animation: slideInLeft 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                }
                .animate-slide-in-right {
                    animation: slideInRight 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                }
            `}</style>

            {/* Top HUD */}
            <header className="relative z-50 flex items-center justify-between p-6">
                <div className="flex items-center justify-center size-12 rounded-full bg-black/20 text-white backdrop-blur-md">
                    <span className="material-symbols-outlined text-[28px]">pause</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 bg-black/30 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                        <span className="material-symbols-outlined text-primary text-sm">schedule</span>
                        <span className="text-white text-sm font-bold tracking-widest">BATTLE PHASE</span>
                    </div>
                </div>
                <div className="flex items-center justify-center size-12 rounded-full bg-black/20 text-white backdrop-blur-md">
                    <span className="material-symbols-outlined text-[28px]">settings</span>
                </div>
            </header>

            {/* Main Battle Area */}
            <main className="flex-1 relative flex flex-col items-center justify-center w-full max-w-md mx-auto clash-perspective px-4 py-6">
                {/* Ambient Aura Background */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] opacity-50 mix-blend-screen"></div>
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] mix-blend-color-dodge animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-red-600/20 rounded-full blur-[80px] mix-blend-color-dodge animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                {/* Clash Container */}
                <div className="relative w-full aspect-[4/5] flex items-center justify-center z-10">

                    {/* VS Indicator */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center"
                    >
                        <div className="relative size-20 flex items-center justify-center">
                            <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-80 animate-pulse"></div>
                            <div className="relative bg-black border-4 border-primary rounded-full size-16 flex items-center justify-center shadow-[0_0_20px_rgba(249,245,6,0.6)]">
                                <span className="text-primary font-bold text-2xl italic tracking-tighter pr-0.5">VS</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Player 1 Card (Attacker) */}
                    <div className="absolute left-0 w-[55%] h-[80%] card-left animate-slide-in-left">
                        {/* Status Badge */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-40">
                            <div className="bg-primary text-black text-sm font-bold px-4 py-1.5 rounded-full shadow-lg border-2 border-white flex items-center gap-1">
                                <span className="material-symbols-outlined text-base font-bold">swords</span>
                                <span>공격</span>
                            </div>
                        </div>
                        {/* Card Body */}
                        <div className="w-full h-full rounded-2xl overflow-hidden border-[3px] border-primary bg-gray-800 relative shadow-2xl">
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url('${playerCard.image}')` }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <p className="text-white font-bold text-lg leading-none">{playerCard.name}</p>
                                <p className="text-primary/80 text-xs mt-1">ATK {playerCard.attack}</p>
                            </div>
                        </div>
                    </div>

                    {/* Player 2 Card (Defender) */}
                    <div className="absolute right-0 w-[55%] h-[80%] card-right animate-slide-in-right">
                        {/* Status Badge */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-40">
                            <div className="bg-gray-700 text-gray-300 text-sm font-bold px-4 py-1.5 rounded-full shadow-lg border border-gray-500 flex items-center gap-1">
                                <span className="material-symbols-outlined text-base">shield</span>
                                <span>방어</span>
                            </div>
                        </div>

                        {/* Damage Float Text (Shown in phase 1) */}
                        {phase >= 1 && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0, y: 20 }}
                                animate={{ scale: 1.5, opacity: 1, y: 0 }}
                                className="absolute top-1/4 -right-4 z-50"
                            >
                                <h1 className="text-6xl font-black text-primary drop-shadow-[0_4px_0_rgba(0,0,0,1)] italic tracking-tighter" style={{ textShadow: '0 0 20px rgba(249,245,6,0.8)' }}>
                                    -{playerCard.attack}
                                </h1>
                            </motion.div>
                        )}

                        {/* Card Body */}
                        <div className={`w-full h-full rounded-2xl overflow-hidden border-2 border-gray-600 bg-gray-800 relative shadow-xl ${phase >= 1 ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
                            <div className="absolute inset-0 bg-cover bg-center grayscale-[0.3]" style={{ backgroundImage: `url('${opponentCard.image}')` }}></div>
                            {/* Hit Effect Overlay */}
                            {phase === 1 && <div className="absolute inset-0 bg-white/30 mix-blend-overlay animate-pulse"></div>}

                            <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                                <p className="text-gray-300 font-bold text-lg leading-none">{opponentCard.name}</p>
                                <p className="text-gray-500 text-xs mt-1">ATK {opponentCard.attack}</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Combat Log */}
                <div className={`mt-4 z-20 transition-opacity duration-500 ${phase >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="bg-gradient-to-r from-transparent via-primary/20 to-transparent px-8 py-2 rounded-lg border-y border-primary/30">
                        <p className="text-primary text-xl font-bold tracking-widest text-center uppercase drop-shadow-md">
                            BATTLE START! <span className="text-white text-sm ml-2 font-normal opacity-80">배틀 개시!</span>
                        </p>
                    </div>
                </div>
            </main>

            {/* Bottom Stats Area */}
            <section className="relative z-10 w-full bg-[#15150a]/90 backdrop-blur-lg border-t border-white/5 pb-8 pt-6 px-6 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                <div className="max-w-md mx-auto flex gap-6">
                    {/* Player 1 Stats */}
                    <div className="flex-1 flex flex-col gap-2">
                        <div className="flex justify-between items-end">
                            <span className="text-primary font-bold text-lg">P1</span>
                            <span className="text-white font-bold text-2xl">{playerHp} <span className="text-xs text-gray-400 font-normal">/ {playerMaxHp}</span></span>
                        </div>
                        <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden border border-white/10">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-yellow-300 relative transition-all duration-500"
                                style={{ width: `${(playerHp / playerMaxHp) * 100}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-1">
                            <div className="size-2 rounded-full bg-primary shadow-[0_0_8px_#f9f506]"></div>
                            <span className="text-gray-400 text-xs">Active Turn</span>
                        </div>
                    </div>

                    {/* Player 2 Stats */}
                    <div className="flex-1 flex flex-col gap-2 opacity-80">
                        <div className="flex justify-between items-end flex-row-reverse">
                            <span className="text-red-500 font-bold text-lg">P2</span>
                            <span className="text-white font-bold text-2xl">{opponentHp} <span className="text-xs text-gray-400 font-normal">/ {opponentMaxHp}</span></span>
                        </div>
                        <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden border border-white/10 flex justify-end">
                            <div
                                className="h-full bg-red-600 transition-all duration-500"
                                style={{ width: `${(opponentHp / opponentMaxHp) * 100}%` }}
                            ></div>
                        </div>
                        <div className="flex gap-2 mt-1 justify-end">
                            <span className="text-gray-500 text-xs">Waiting</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ClashScene;
