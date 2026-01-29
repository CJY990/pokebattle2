import React, { useState, useEffect, useRef } from 'react';
import type { Card } from '../types';
import { getRandomCards, getRandomCard, ALL_CARDS } from '../data/cards';
import { motion, AnimatePresence } from 'framer-motion';
import ClashScene from './ClashScene'; // [NEW] ClashScene Import

import { getDamageMultiplier } from '../data/typeChart';

const BattleScreen: React.FC = () => {
    // Game State
    const [round, setRound] = useState(1);
    const [maxRounds] = useState(5);

    // Player State
    const [playerHand, setPlayerHand] = useState<Card[]>([]);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const [playerFieldCard, setPlayerFieldCard] = useState<Card | null>(null);
    const [playerHp, setPlayerHp] = useState(500);

    // Opponent State
    const [opponentHand, setOpponentHand] = useState<Card[]>([]);
    const [opponentFieldCard, setOpponentFieldCard] = useState<Card | null>(null);
    const [opponentHp, setOpponentHp] = useState(500);

    // UI/Flow State
    const [isBattling, setIsBattling] = useState(false);
    const [battleResultMessage, setBattleResultMessage] = useState<string | null>(null);
    const [gameOverMessage, setGameOverMessage] = useState<string | null>(null);
    const [turnIndicator, setTurnIndicator] = useState<'player' | 'opponent' | 'battle'>('player');

    // 애니메이션 State
    const [drawingCard, setDrawingCard] = useState<Card | null>(null);

    // [NEW] Clash Animation State
    const [showClashScene, setShowClashScene] = useState(false);

    // 스크롤 Ref
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // 초기 카드 배분 및 이미지 프리로딩
    useEffect(() => {
        setPlayerHand(getRandomCards(5));
        setOpponentHand(getRandomCards(5));

        // 이미지 프리로딩
        ALL_CARDS.forEach(card => {
            const img = new Image();
            img.src = card.image;
        });
    }, []);

    // 턴 시작 시 드로우 (2라운드부터)
    useEffect(() => {
        if (round > 1 && round <= maxRounds) {
            drawCardSequence();
        }
    }, [round]);



    const drawCardSequence = async () => {
        // 1. 데이터 생성
        const newCard = getRandomCard();
        const newOppCard = getRandomCard();

        // 2. 덱 위치에 카드 생성 (Drawing State) - 중앙에 등장
        setDrawingCard(newCard);

        // 3. 유저가 카드를 확인하도록 잠시 대기 (800ms) 후 핸드로 이동 ("부메랑" 효과처럼 날아감)
        setTimeout(() => {
            setPlayerHand(prev => [...prev, newCard]);
            setOpponentHand(prev => [...prev, newOppCard]);

            // Drawing State 초기화 -> 이때 layoutId를 통해 핸드 위치로 날아가는 애니메이션 발생
            setDrawingCard(null);

            // [NEW] 스크롤을 오른쪽 끝으로 이동하여 새로 받은 카드를 보여줌
            setTimeout(() => {
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo({
                        left: scrollContainerRef.current.scrollWidth,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }, 800);
    };

    // 마우스 드래그 스크롤 핸들러
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollContainerRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 2; // 스크롤 속도 조절
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleCardSelect = (cardId: string) => {
        if (isBattling || showClashScene) return; // 배틀 중 선택 방지
        setSelectedCardId(cardId);
    };

    const handleBattleStart = () => {
        if (!selectedCardId || isBattling) return;

        const playerCard = playerHand.find(c => c.id === selectedCardId);
        if (!playerCard) return;

        // 1. 배틀 상태 진입 및 상대 카드 결정
        setIsBattling(true);
        const randomOpponentCard = opponentHand[Math.floor(Math.random() * opponentHand.length)];

        // 2. 필드에 카드 배치 (현재 화면 상태 유지)
        setPlayerFieldCard(playerCard);
        setOpponentFieldCard(randomOpponentCard);

        // 핸드에서 제거
        setPlayerHand(prev => prev.filter(c => c.id !== selectedCardId));
        setOpponentHand(prev => prev.filter(c => c.id !== randomOpponentCard.id));
        setSelectedCardId(null);

        // 3. 1초 대기 후 ClashScene 전환 (Step 2)
        setTimeout(() => {
            setShowClashScene(true);
        }, 1000);
    };

    // ClashScene 애니메이션이 끝난 후 호출될 함수
    const handleClashComplete = () => {
        if (!playerFieldCard || !opponentFieldCard) return; // Should not happen

        setShowClashScene(false);
        resolveBattle(playerFieldCard, opponentFieldCard);
    };

    const resolveBattle = (pCard: Card, oCard: Card) => {
        // 상성 계산 (1.5배)
        // 플레이어 공격 시 상성 (Player -> Opponent)
        const pMultiplier = getDamageMultiplier(pCard.type || 'normal', oCard.type || 'normal');
        // 상대 공격 시 상성 (Opponent -> Player)
        const oMultiplier = getDamageMultiplier(oCard.type || 'normal', pCard.type || 'normal');

        // 데미지 적용
        const oDamage = Math.floor(pCard.attack * pMultiplier); // 상대가 받는 데미지
        const pDamage = Math.floor(oCard.attack * oMultiplier); // 플레이어가 받는 데미지

        let msg = '';

        // 효과 메시지 추가
        if (pMultiplier > 1) msg += `효과가 굉장했다! (${pCard.type} -> ${oCard.type}) `;
        if (oMultiplier > 1) msg += `상대의 공격이 매서웠다! (${oCard.type} -> ${pCard.type}) `;

        msg += `\n당신: -${pDamage} HP | 상대: -${oDamage} HP`;

        setPlayerHp(prev => Math.max(0, prev - pDamage));
        setOpponentHp(prev => Math.max(0, prev - oDamage));
        setBattleResultMessage(msg);

        // 잠시 후 필드 정리 및 게임 종료 여부 확인
        setTimeout(() => {
            setPlayerFieldCard(null);
            setOpponentFieldCard(null);
            setBattleResultMessage(null);
            setIsBattling(false);

            const newPlayerHp = playerHp - pDamage;
            const newOppHp = opponentHp - oDamage;

            if (newOppHp <= 0) {
                finishGame('player');
            } else if (newPlayerHp <= 0) {
                finishGame('opponent');
            } else if (round >= maxRounds) {
                if (newPlayerHp > newOppHp) finishGame('player');
                else if (newOppHp > newPlayerHp) finishGame('opponent');
                else finishGame('draw');
            } else {
                setTurnIndicator('battle');
                setTimeout(() => {
                    setRound(r => r + 1);
                    setTurnIndicator('player');
                }, 1000);
            }
        }, 2500); // 결과 및 상성 메시지를 읽을 시간을 위해 대기 시간 증가
    };

    const finishGame = (winner: 'player' | 'opponent' | 'draw') => {
        setIsBattling(false);

        let resultMessage = '';
        if (winner === 'player') resultMessage = "승리! 상대방의 HP가 0이 되었습니다.";
        else if (winner === 'opponent') resultMessage = "패배... 당신의 HP가 0이 되었습니다.";
        else resultMessage = "무승부! 모든 라운드가 종료되었습니다.";

        setGameOverMessage(resultMessage);
        setTurnIndicator('battle');
    };

    // --- Render Helpers ---

    const renderGameOver = () => {
        if (!gameOverMessage) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-slate-900 border-2 border-primary p-8 rounded-2xl max-w-md w-full text-center shadow-[0_0_50px_rgba(249,245,6,0.2)]">
                    <h2 className="text-3xl font-bold text-white mb-2">GAME OVER</h2>
                    <p className="text-xl text-primary mb-8">{gameOverMessage}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-primary text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition-colors shadow-lg active:scale-95"
                    >
                        다시 시작하기
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="relative flex h-full w-full flex-col max-w-md mx-auto shadow-2xl overflow-hidden bg-background-light dark:bg-background-dark text-white font-sans">
            <style>{`
                .text-shadow { text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8); }
                .vs-circle {
                    background: radial-gradient(circle, #facc15 0%, #a16207 70%, #000000 100%);
                    box-shadow: 0 0 30px rgba(250, 204, 21, 0.6);
                }
                .card-p1-field {
                    box-shadow: 0 0 15px rgba(74, 222, 128, 0.5), inset 0 0 10px rgba(74, 222, 128, 0.3);
                    border: 2px solid #4ade80;
                }
                .card-p2-field {
                    box-shadow: 0 0 15px rgba(168, 85, 247, 0.5), inset 0 0 10px rgba(168, 85, 247, 0.3);
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
            `}</style>

            {renderGameOver()}

            {/* Clash Scene Overlay */}
            {showClashScene && playerFieldCard && opponentFieldCard && (
                <ClashScene
                    playerCard={playerFieldCard}
                    opponentCard={opponentFieldCard}
                    playerHp={playerHp}
                    playerMaxHp={500}
                    opponentHp={opponentHp}
                    opponentMaxHp={500}
                    onComplete={handleClashComplete}
                />
            )}

            {/* Battle Result Message Overlay */}
            <AnimatePresence>
                {battleResultMessage && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="fixed inset-0 z-[110] flex items-center justify-center p-6 pointer-events-none"
                    >
                        <div className="bg-black/80 backdrop-blur-xl border-2 border-primary/50 text-white text-center py-6 px-8 rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.8)] max-w-xs">
                            <p className="text-2xl font-display font-black text-primary italic uppercase tracking-tighter mb-2">BATTLE RESULT</p>
                            <p className="text-sm font-bold opacity-90 leading-relaxed text-shadow">{battleResultMessage}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background Texture */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] z-0"></div>

            {/* Top Bar - Minimalized */}
            <div className="relative z-20 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center gap-2">
                    <span className="text-primary font-display text-xl tracking-tighter italic">ARENA</span>
                    <div className="h-4 w-[1px] bg-white/20 mx-1"></div>
                    <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Round {round}/{maxRounds}</span>
                </div>
                <div className="flex gap-2">
                    {opponentHand.map((_, i) => (
                        <div key={i} className="w-2 h-3 bg-gray-600 rounded-sm border border-white/10"></div>
                    ))}
                </div>
            </div>

            {/* Main Battle Field (Center Area) */}
            <div className="flex-1 flex flex-col justify-center relative items-center px-4 w-full">

                {/* Deck Area (Center) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="relative w-24 h-36 bg-slate-800 rounded-lg border border-white/10 shadow-xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-300">
                        <div className="absolute inset-0 border-2 border-white/5 rounded-lg m-1"></div>
                        <span className="material-symbols-outlined text-white/10 text-4xl">style</span>
                    </div>

                    {/* Drawing Cards Overlay - Rendered OUTSIDE the transformed container */}
                    <AnimatePresence>
                        {drawingCard && (
                            <motion.div
                                layoutId={drawingCard.id}
                                className="fixed inset-0 w-24 h-36 rounded-lg bg-slate-700 z-[100] border border-white/20 shadow-2xl pointer-events-none"
                                style={{
                                    top: '50%',
                                    left: '50%',
                                    x: '-50%',
                                    y: '-50%'
                                }}
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 1, opacity: 1 }} // Stay visible until it snaps to hand
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            >
                                <div className="h-full w-full bg-cover bg-center rounded-lg opacity-100" style={{ backgroundImage: `url('${drawingCard.image}')` }} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* VS Circle */}
                {
                    (playerFieldCard || opponentFieldCard) && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0, x: '-50%', y: '-50%' }}
                            animate={{ scale: 1, opacity: 1, x: '-50%', y: '-50%' }}
                            className="absolute z-30 top-1/2 left-1/2 pointer-events-none"
                        >
                            <div className="vs-circle w-16 h-16 rounded-full flex items-center justify-center border-2 border-black/50 backdrop-blur-sm relative">
                                <span className="font-display italic font-black text-3xl text-black transform -skew-x-12 relative z-10">VS</span>
                            </div>
                        </motion.div>
                    )
                }

                {/* Cards Container */}
                <div className="flex w-full justify-between items-center h-[50vh] relative z-20">
                    {/* Player Field Slot */}
                    <div className="flex-1 h-full flex flex-col justify-center items-center pr-2">
                        <AnimatePresence mode='wait'>
                            {playerFieldCard ? (
                                <motion.div
                                    key={playerFieldCard.id}
                                    layoutId={playerFieldCard.id}
                                    className="card-p1-field relative rounded-xl overflow-hidden bg-gray-900 h-[65%] w-full max-w-[160px] shadow-2xl"
                                >
                                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${playerFieldCard.image}')` }}>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 w-full p-2 flex flex-col items-center text-center">
                                        <h2 className="font-display text-lg text-white text-shadow leading-none mb-1">{playerFieldCard.name}</h2>
                                        <div className="grid grid-cols-2 gap-1 mt-1 w-full">
                                            <div className="bg-black/60 rounded p-1 text-center">
                                                <div className="text-[8px] text-gray-400 font-bold">HP</div>
                                                <div className="text-xs font-bold text-green-400">{playerFieldCard.hp}</div>
                                            </div>
                                            <div className="bg-black/60 rounded p-1 text-center">
                                                <div className="text-[8px] text-gray-400 font-bold">ATK</div>
                                                <div className="text-xs font-bold text-yellow-400">{playerFieldCard.attack}</div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="h-[65%] w-full max-w-[160px] rounded-xl border-2 border-dashed border-white/10 bg-white/5 flex items-center justify-center">
                                    <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Your Selection</span>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Opponent Field Slot */}
                    <div className="flex-1 h-full flex flex-col justify-center items-center pl-2">
                        <AnimatePresence mode='wait'>
                            {opponentFieldCard ? (
                                <motion.div
                                    key="opp-field"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="card-p2-field relative rounded-xl overflow-hidden bg-gray-900 h-[65%] w-full max-w-[160px] shadow-2xl"
                                >
                                    <div className="absolute inset-0 bg-cover bg-center filter grayscale-[30%]" style={{ backgroundImage: `url('${opponentFieldCard.image}')` }}>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 w-full p-2 flex flex-col items-center text-center">
                                        <h2 className="font-display text-lg text-white text-shadow leading-none mb-1">{opponentFieldCard.name}</h2>
                                        <div className="grid grid-cols-2 gap-1 mt-1 w-full">
                                            <div className="bg-black/60 rounded p-1 text-center">
                                                <div className="text-[8px] text-gray-400 font-bold">HP</div>
                                                <div className="text-xs font-bold text-purple-400">{opponentFieldCard.hp}</div>
                                            </div>
                                            <div className="bg-black/60 rounded p-1 text-center">
                                                <div className="text-[8px] text-gray-400 font-bold">ATK</div>
                                                <div className="text-xs font-bold text-red-400">{opponentFieldCard.attack}</div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="h-[65%] w-full max-w-[160px] rounded-xl border-2 border-dashed border-white/10 bg-white/5 flex items-center justify-center">
                                    <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Enemy Ready</span>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div >

            {/* Bottom Panel (User Hand & Controls) */}
            < div className="mt-auto bg-gradient-to-t from-black via-black/90 to-transparent px-4 pb-6 pt-12 relative z-20" >

                {/* Hand Selection */}
                < div
                    ref={scrollContainerRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    className="flex overflow-x-auto gap-3 py-4 no-scrollbar snap-x h-[160px] items-end cursor-grab active:cursor-grabbing"
                >
                    <AnimatePresence mode='popLayout'>
                        {playerHand.map((card) => (
                            <motion.div
                                key={card.id}
                                layoutId={card.id}
                                onClick={() => !isDragging && handleCardSelect(card.id)}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: selectedCardId === card.id ? -15 : 0,
                                    zIndex: selectedCardId === card.id ? 20 : 1
                                }}
                                exit={{ scale: 0, opacity: 0, y: 50 }}
                                className={`shrink-0 w-24 h-36 rounded-lg overflow-hidden border transition-all duration-300 snap-center
                                    ${selectedCardId === card.id ? 'border-primary shadow-[0_0_15px_rgba(234,179,8,0.5)] bg-slate-800' : 'border-white/10 bg-slate-900'}
                                `}
                            >
                                <div className="h-[60%] w-full bg-cover bg-center" style={{ backgroundImage: `url('${card.image}')` }}></div>
                                <div className="p-1.5 text-center flex flex-col justify-end h-[40%]">
                                    <p className="text-[10px] font-bold truncate leading-none mb-1 text-white/90">{card.name}</p>
                                    <div className="flex justify-center gap-1.5 pt-1 border-t border-white/10">
                                        <div className="flex items-center space-x-0.5 bg-black/40 px-1 rounded">
                                            <span className="text-[6px] text-gray-400">HP</span>
                                            <span className="text-[8px] text-green-400 font-bold">{card.hp}</span>
                                        </div>
                                        <div className="flex items-center space-x-0.5 bg-black/40 px-1 rounded">
                                            <span className="text-[6px] text-gray-400">ATK</span>
                                            <span className="text-[8px] text-yellow-400 font-bold">{card.attack}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div >

                {/* Status & Battle Button (HP Area) */}
                < div className="mt-4" >
                    <div className="text-center mb-4">
                        <div className="inline-block bg-yellow-900/30 border border-yellow-500/20 rounded-full px-4 py-1 backdrop-blur-md">
                            <span className="text-primary font-bold tracking-widest text-[10px] uppercase">
                                {selectedCardId ? "Ready to Clash!" : "Select your Pokemon"}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-end justify-between space-x-2">
                        {/* Player Stats */}
                        <div className="flex-1 flex flex-col justify-end min-w-0">
                            <div className="flex items-baseline mb-1">
                                <span className="text-xl font-bold text-white">{playerHp}</span>
                                <span className="text-[10px] text-gray-500 ml-1">/ 500</span>
                            </div>
                            <div className="h-4 w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                                <div className="h-full bg-primary shadow-[0_0_10px_rgba(234,179,8,0.5)]" style={{ width: `${(playerHp / 500) * 100}%` }}></div>
                            </div>
                            <div className="flex items-center mt-1 space-x-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${turnIndicator === 'player' ? 'bg-primary animate-pulse' : 'bg-gray-600'}`}></div>
                                <span className="text-[10px] text-gray-500 uppercase tracking-tighter">YOU</span>
                            </div>
                        </div>

                        {/* Battle Button */}
                        <div className="relative z-10 flex-shrink-0 px-2 flex flex-col items-center">
                            <button
                                onClick={handleBattleStart}
                                disabled={!selectedCardId || isBattling}
                                className={`bg-primary text-black font-display font-black text-xs px-6 py-2.5 pixel-corners shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 transition-all flex flex-col items-center leading-none min-w-[100px]
                                    ${(!selectedCardId || isBattling) ? 'opacity-50 grayscale cursor-not-allowed shadow-none active:translate-y-0' : 'hover:bg-yellow-400'}
                                `}
                            >
                                <span>BATTLE</span>
                                <span className="text-[8px] font-sans font-bold mt-0.5 opacity-80">START!</span>
                            </button>
                        </div>

                        {/* Opponent Stats */}
                        <div className="flex-1 flex flex-col items-end justify-end min-w-0">
                            <div className="flex items-baseline mb-1">
                                <span className="text-xl font-bold text-white">{(opponentHp / 500) * 500}</span>
                                <span className="text-[10px] text-gray-500 ml-1">/ 500</span>
                            </div>
                            <div className="h-4 w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                                <div className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)] float-right" style={{ width: `${(opponentHp / 500) * 100}%` }}></div>
                            </div>
                            <div className="flex items-center mt-1 space-x-1 justify-end">
                                <span className="text-[10px] text-gray-500 uppercase tracking-tighter">ENEMY</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </div >
    );
};

export default BattleScreen;
