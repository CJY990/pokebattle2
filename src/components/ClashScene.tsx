import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Card } from '../types';

interface ClashSceneProps {
    playerCard: Card;
    opponentCard: Card;
    playerHp: number;
    playerMaxHp: number;
    opponentHp: number;
    opponentMaxHp: number;
    onComplete: () => void;
}

const ClashScene: React.FC<ClashSceneProps> = ({
    playerCard,
    opponentCard,
    playerHp,
    playerMaxHp,
    opponentHp,
    opponentMaxHp,
    onComplete
}) => {
    const [phase, setPhase] = useState(0); // 0: Preview, 1: Attack/Impact, 2: Post-Impact

    useEffect(() => {
        // Timeline:
        // 0s: Preview (Side by side)
        // 1.5s: Impact (Shake + Damage)
        // 4s: Complete
        const t1 = setTimeout(() => setPhase(1), 1500);
        const t2 = setTimeout(() => onComplete(), 4000);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[100] bg-background-light font-sans overflow-hidden flex flex-col text-white">
            <style>{`
                .text-shadow {
                    text-shadow: 2px 2px 8px rgba(0, 0, 0, 1);
                }
                .vs-circle {
                    background: radial-gradient(circle, #facc15 0%, #a16207 70%, #000000 100%);
                    box-shadow: 0 0 50px rgba(250, 204, 21, 0.4);
                }
                .card-container {
                    perspective: 1200px;
                }
                .card-p1 {
                    box-shadow: 0 0 30px rgba(74, 222, 128, 0.3), inset 0 0 15px rgba(74, 222, 128, 0.2);
                    border: 2px solid #4ade80;
                }
                .card-p2 {
                    box-shadow: 0 0 30px rgba(168, 85, 247, 0.3), inset 0 0 15px rgba(168, 85, 247, 0.2);
                    border: 2px solid #a855f7;
                }
                .pixel-corners {
                     clip-path: polygon(
                        0px 6px, 6px 6px, 6px 0px, 
                        calc(100% - 6px) 0px, calc(100% - 6px) 6px, 100% 6px, 
                        100% calc(100% - 6px), calc(100% - 6px) calc(100% - 6px), calc(100% - 6px) 100%, 
                        6px 100%, 6px calc(100% - 6px), 0px calc(100% - 6px)
                    );
                }
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
            `}</style>

            {/* Cinematic Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-900/80 to-black"></div>
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

            {/* Dynamic Light Rays */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden origin-center rotate-45">
                <div className="absolute top-0 left-1/4 w-1/2 h-[200%] bg-gradient-to-r from-transparent via-white/5 to-transparent blur-3xl opacity-30"></div>
            </div>

            <div className="w-full max-w-[95vw] mx-auto h-screen flex flex-col relative z-10 px-6 py-8">
                {/* Battle Area */}
                <div className="flex-1 flex flex-col justify-center relative items-center w-full">

                    {/* VS Circle - Absolute Center independent of grid */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
                        <motion.div
                            initial={{ scale: 0, opacity: 0, rotate: -180 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                        >
                            <div className="vs-circle w-40 h-40 rounded-full flex items-center justify-center border-4 border-black relative overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8)]">
                                <motion.div
                                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute inset-0 bg-white/20"
                                />
                                <span className="font-display italic font-black text-7xl text-black transform -skew-x-12 z-10 drop-shadow-md pr-2 pt-1">VS</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Cards Container */}
                    <div className="flex w-full justify-center items-center gap-12 h-[65vh] px-4">
                        {/* Player Card */}
                        <motion.div
                            initial={{ x: -200, opacity: 0, rotateY: -30 }}
                            animate={{
                                x: phase === 1 ? [0, 60, 0] : 0,
                                opacity: 1,
                                rotateY: 0,
                                scale: phase === 1 ? 1.1 : 1,
                                zIndex: phase === 1 ? 50 : 10
                            }}
                            className="flex-1 max-w-[600px] h-full flex flex-col justify-center card-container bg-transparent group"
                        >
                            <div className="card-p1 relative rounded-[2.5rem] overflow-hidden bg-gray-900 aspect-[2/3] w-full shadow-[0_0_60px_rgba(0,0,0,0.6)] border-2 animate-float transition-all duration-300">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-110" style={{ backgroundImage: `url('${playerCard.image}')` }}>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                                </div>
                                <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col items-center text-center z-10">
                                    <h2 className="font-display text-4xl text-white text-shadow leading-none mb-3 italic font-black uppercase tracking-tighter">{playerCard.name}</h2>
                                    <div className="grid grid-cols-2 gap-4 w-full px-2">
                                        <div className="bg-black/80 backdrop-blur-md rounded-lg p-2 border border-white/10 text-center shadow-lg">
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">HP</div>
                                            <div className="text-xl font-black text-green-400">{playerCard.hp}</div>
                                        </div>
                                        <div className="bg-black/80 backdrop-blur-md rounded-lg p-2 border border-white/10 text-center shadow-lg">
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ATK</div>
                                            <div className="text-xl font-black text-yellow-400">{playerCard.attack}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Flash effect on player card when attacking */}
                                {phase === 1 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: [0, 0.8, 0] }}
                                        className="absolute inset-0 bg-primary z-40 mix-blend-overlay"
                                    />
                                )}
                            </div>
                        </motion.div>

                        {/* Opponent Card */}
                        <motion.div
                            initial={{ x: 200, opacity: 0, rotateY: 30 }}
                            animate={{
                                x: phase === 1 ? [0, -40, 0] : 0,
                                opacity: 1,
                                rotateY: 0,
                                scale: phase === 1 ? 1.1 : 1
                            }}
                            className="flex-1 max-w-[600px] h-full flex flex-col justify-center card-container bg-transparent group"
                        >
                            <div className={`card-p2 relative rounded-[2.5rem] overflow-hidden bg-gray-900 aspect-[2/3] w-full shadow-[0_0_60px_rgba(0,0,0,0.6)] border-2 ${phase === 1 ? 'animate-shake' : ''}`}>
                                <div className="absolute inset-0 bg-cover bg-center grayscale-[20%] transition-transform duration-700 hover:scale-110" style={{ backgroundImage: `url('${opponentCard.image}')` }}>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                                    <div className="absolute inset-0 bg-purple-900/10 mix-blend-overlay"></div>
                                </div>
                                <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col items-center text-center z-10">
                                    <h2 className="font-display text-4xl text-white text-shadow leading-none mb-3 italic font-black uppercase tracking-tighter">{opponentCard.name}</h2>
                                    <div className="grid grid-cols-2 gap-4 w-full px-2">
                                        <div className="bg-black/80 backdrop-blur-md rounded-lg p-2 border border-white/10 text-center order-2 shadow-lg">
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">HP</div>
                                            <div className="text-xl font-black text-purple-400">{opponentCard.hp}</div>
                                        </div>
                                        <div className="bg-black/80 backdrop-blur-md rounded-lg p-2 border border-white/10 text-center order-1 shadow-lg">
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ATK</div>
                                            <div className="text-xl font-black text-red-500">{opponentCard.attack}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Impact Flash on opponent */}
                                {phase === 1 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute inset-0 bg-white z-40"
                                    />
                                )}

                                {/* Damage Floating Text */}
                                <AnimatePresence>
                                    {phase === 1 && (
                                        <motion.div
                                            initial={{ y: 0, opacity: 0, scale: 0.5 }}
                                            animate={{ y: -80, opacity: 1, scale: 2 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                                        >
                                            <span className="text-8xl font-black text-red-500 italic drop-shadow-[0_8px_0_rgba(0,0,0,1)]">-{playerCard.attack}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom UI - Matching BattleScreen */}
                <div className="mt-auto pb-10 relative z-20">
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-block bg-yellow-900/40 border border-yellow-500/30 rounded-full px-8 py-2.5 backdrop-blur-lg shadow-xl"
                        >
                            <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase animate-pulse">
                                {phase === 0 ? "LOCKING TARGETS..." : "CRITICAL IMPACT!"}
                            </span>
                        </motion.div>
                    </div>

                    <div className="flex items-end justify-between space-x-4">
                        {/* Player Health */}
                        <div className="flex-1 flex flex-col justify-end min-w-0">
                            <div className="flex items-baseline mb-2">
                                <span className="text-3xl font-display font-black text-white">{playerHp}</span>
                                <span className="text-xs text-gray-500 ml-2 font-bold">/ {playerMaxHp}</span>
                            </div>
                            <div className="h-5 w-full bg-gray-950 rounded-full overflow-hidden relative border border-white/10 shadow-inner">
                                <motion.div
                                    initial={{ width: `${(playerHp / playerMaxHp) * 100}%` }}
                                    animate={{ width: phase === 1 ? `${Math.max(0, (playerHp - opponentCard.attack) / playerMaxHp) * 100}%` : `${(playerHp / playerMaxHp) * 100}%` }}
                                    className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_20px_rgba(234,179,8,0.8)]"
                                />
                                <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-b from-white/20 via-transparent to-black/20"></div>
                            </div>
                            <div className="flex items-center mt-3 space-x-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(234,179,8,1)]"></div>
                                <span className="text-xs text-gray-400 font-black uppercase tracking-widest">PLAYER 1</span>
                            </div>
                        </div>

                        {/* Battle Action Indicator */}
                        <div className="relative z-10 flex-shrink-0 px-2 flex flex-col items-center">
                            <div className="bg-primary text-black font-display font-black text-sm px-6 py-3 pixel-corners shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center leading-none min-w-[120px] scale-110">
                                <span>{phase === 0 ? "BATTLE" : "CLASH"}</span>
                                <span className="text-[9px] font-sans font-black mt-1.5 opacity-70 tracking-tighter">IN PROGRESS</span>
                            </div>
                        </div>

                        {/* Opponent Health */}
                        <div className="flex-1 flex flex-col items-end justify-end min-w-0">
                            <div className="flex items-baseline mb-2 justify-end">
                                <span className="text-3xl font-display font-black text-white">{opponentHp}</span>
                                <span className="text-xs text-gray-500 ml-2 font-bold">/ {opponentMaxHp}</span>
                            </div>
                            <div className="h-5 w-full bg-gray-950 rounded-full overflow-hidden relative border border-white/10 shadow-inner">
                                <motion.div
                                    initial={{ width: `${(opponentHp / opponentMaxHp) * 100}%` }}
                                    animate={{ width: phase === 1 ? `${Math.max(0, (opponentHp - playerCard.attack) / opponentMaxHp) * 100}%` : `${(opponentHp / opponentMaxHp) * 100}%` }}
                                    className="absolute top-0 right-0 h-full bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.8)]"
                                />
                                <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-b from-white/20 via-transparent to-black/20 text-right"></div>
                            </div>
                            <div className="flex items-center mt-3 space-x-2 justify-end">
                                <span className="text-xs text-gray-400 font-black uppercase tracking-widest text-right">ENEMY ALPHA</span>
                                <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_rgba(220,38,38,1)]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClashScene;

