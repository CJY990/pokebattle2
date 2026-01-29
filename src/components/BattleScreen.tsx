import React, { useState, useEffect, useRef } from 'react';
import type { Card } from '../types';
import { getRandomCards, getRandomCard, ALL_CARDS } from '../data/cards';
import { motion, AnimatePresence } from 'framer-motion';
import ClashScene from './ClashScene'; // [NEW] ClashScene Import

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
    const [drawingOppCard, setDrawingOppCard] = useState<Card | null>(null);

    // [NEW] Clash Animation State
    const [showClashScene, setShowClashScene] = useState(false);

    // 스크롤 Ref
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // (DeckPosition 관련 코드는 이제 불필요할 수 있으나 유지는 해둠)
    const deckRef = useRef<HTMLDivElement>(null);

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

        // 2. 덱 위치에 카드 생성 (Drawing State)
        setDrawingCard(newCard);
        setDrawingOppCard(newOppCard);

        // 3. 짧은 딜레이 후 핸드로 이동 (State Transfer)
        // Framer Motion이 layoutId가 같은 컴포넌트 간의 위치 변화를 감지하고 애니메이션 처리함
        setTimeout(() => {
            setPlayerHand(prev => [...prev, newCard]);
            setOpponentHand(prev => [...prev, newOppCard]);

            // Drawing State 초기화 (핸드에 렌더링되는 즉시 제거해야 끊김 없음)
            setDrawingCard(null);
            setDrawingOppCard(null);

            // [NEW] 스크롤을 오른쪽 끝으로 이동하여 새로 받은 카드를 보여줌
            setTimeout(() => {
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo({
                        left: scrollContainerRef.current.scrollWidth,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }, 100); // 렌더링 타이밍 확보를 위한 최소 딜레이
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
        // 데미지 계산 및 결과 처리 로직 (기존과 동일하되 인자 직접 받음)
        // 상대 카드 속성 등 복잡한 로직이 있다면 여기서 계산
        let pDamage = oCard.attack;
        let oDamage = pCard.attack; // 플레이어가 상대에게 주는 데미지

        // 간단한 상성 로직 (예시)
        if (pCard.type === 'fire' && oCard.type === 'grass') oDamage *= 1.5;
        if (oCard.type === 'fire' && pCard.type === 'grass') pDamage *= 1.5;

        let msg = `당신은 ${Math.floor(oDamage)} 데미지를 주었고, ${Math.floor(pDamage)} 데미지를 받았습니다!`;

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
        }, 1000);
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
        <div className="relative flex h-full w-full flex-col max-w-md mx-auto shadow-2xl overflow-hidden bg-background-light dark:bg-background-dark">
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
            {battleResultMessage && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-full px-4">
                    <div className="bg-black/70 backdrop-blur border border-white/20 text-white text-center py-4 rounded-xl shadow-2xl animate-pulse">
                        <p className="text-xl font-bold text-primary">{battleResultMessage}</p>
                    </div>
                </div>
            )}

            {/* Top Bar / Opponent Info */}
            <div className="relative z-10 w-full p-4 pb-2 bg-gradient-to-b from-black/60 to-transparent">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="relative">
                            <div
                                className="size-12 rounded-full border-2 border-primary bg-cover bg-center"
                                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC84LtWSasHfQUpW2OrIxyxcP14Mq0XELtaVXDZRS5dqpMCSrUYWY8l27b5Y9MFvjw8icteRm1v_khIHNvXU7WBKjPnAI9HtrcCnag8kloyShfcQAZg3TIAQM6BAyx73fm6xY-FXfCzBKaL5EaP1UjVtvHj_M-57bVnO9T4AYbJ1-g1QjWsog9ZjYaYH1eUGZV9rlPU45knrXFeZQvX6br4BBt60jtq3gVvuBMw1lcY2shFcnJx93FbgVTqFixLqcE2HbCOsayPN4Xe')" }}
                            ></div>
                        </div>
                        <div className="flex flex-col w-full max-w-[140px]">
                            <div className="flex justify-between items-end mb-1">
                                <h2 className="text-white text-base tracking-wide leading-tight">트레이너 레드</h2>
                                <span className="text-white text-[10px] font-mono opacity-80">{opponentHp}/100</span>
                            </div>
                            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden border border-white/10">
                                <div
                                    className="h-full bg-red-500 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.max(0, opponentHp)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                    <div className="text-white text-xs font-mono bg-black/40 px-2 py-1 rounded">
                        Round {round}/{maxRounds}
                    </div>
                </div>

                {/* Opponent Hand */}
                <div className="flex justify-center gap-1.5 w-full perspective-[500px] h-14 items-center">
                    <AnimatePresence>
                        {opponentHand.map((card, idx) => (
                            <motion.div
                                key={card.id}
                                layoutId={`opp-${card.id}`}
                                initial={{ opacity: 0, y: -20, rotate: -10 }}
                                animate={{
                                    opacity: 1,
                                    y: Math.abs(idx - opponentHand.length / 2) * 2,
                                    rotate: (idx - opponentHand.length / 2) * 5
                                }}
                                exit={{ opacity: 0, scale: 0 }}
                                className="w-8 h-12 rounded bg-gradient-to-br from-indigo-900 to-slate-900 border border-white/10 shadow-lg origin-bottom"
                            />
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Battle Area (Center) */}
            <div className="relative z-0 flex-1 flex flex-col items-center justify-center w-full py-4 gap-6">
                <div className="relative w-full px-6 flex flex-col gap-6 items-center">

                    {/* Opponent Slot */}
                    <div className="w-32 h-44 rounded-xl border-2 border-dashed border-white/20 bg-black/20 flex items-center justify-center relative overflow-hidden transition-all">
                        <AnimatePresence mode='wait'>
                            {opponentFieldCard ? (
                                <motion.div
                                    key="opp-field"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0"
                                >
                                    <div
                                        className="absolute inset-0 bg-cover bg-center animate-pulse"
                                        style={{ backgroundImage: `url('${opponentFieldCard.image}')` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
                                    </div>
                                    <div className="absolute bottom-2 left-0 w-full flex flex-col items-center z-10 px-1">
                                        <span className="text-white font-bold text-sm shadow-black drop-shadow-md truncate w-full text-center mb-1">{opponentFieldCard.name}</span>
                                        <div className="flex justify-center items-center gap-1 w-full">
                                            <div className="flex items-center gap-0.5 bg-red-900/80 px-1.5 py-0.5 rounded border border-red-500/50 backdrop-blur-sm">
                                                <span className="material-symbols-outlined text-red-500 text-[10px]">favorite</span>
                                                <span className="text-white text-[10px] font-bold">{opponentFieldCard.hp}</span>
                                            </div>
                                            <div className="flex items-center gap-0.5 bg-yellow-900/80 px-1.5 py-0.5 rounded border border-yellow-500/50 backdrop-blur-sm">
                                                <span className="material-symbols-outlined text-yellow-500 text-[10px]">flash_on</span>
                                                <span className="text-white text-[10px] font-bold">{opponentFieldCard.attack}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="opp-empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center w-full h-full"
                                >
                                    <span className="material-symbols-outlined text-white/20 text-4xl">swords</span>
                                    <div className="absolute -top-3 -right-3 bg-slate-800 border border-white/10 rounded-full p-1.5 shadow-lg">
                                        <span className="material-symbols-outlined text-purple-400 text-sm block">verified_user</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Deck Area (Moved to Right Side) */}
                    <div
                        ref={deckRef}
                        className="absolute top-1/2 right-2 -translate-y-1/2 z-20 flex items-center justify-center transform mr-2"
                    >
                        {/* Drawing Card (Player) - 덱에서 생성되어 핸드로 날아갈 임시 카드 */}
                        <AnimatePresence>
                            {drawingCard && (
                                <motion.div
                                    layoutId={drawingCard.id}
                                    className="absolute w-32 h-48 rounded-xl bg-card-surface border border-white/10 overflow-hidden shadow-2xl z-50"
                                    initial={{ scale: 0.2, opacity: 0 }}
                                    animate={{ scale: 0.2, opacity: 1 }} // 덱 사이즈(작게)에서 시작. 핸드로 가면서 scale: 1됨
                                    exit={{ opacity: 1 }} // 사라질 때 fade out 하지 않음 (핸드 카드로 즉시 대체됨)
                                    transition={{ duration: 0 }}
                                >
                                    <div
                                        className="h-28 w-full bg-cover bg-center"
                                        style={{ backgroundImage: `url('${drawingCard.image}')` }}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Drawing Card (Opponent) */}
                        <AnimatePresence>
                            {drawingOppCard && (
                                <motion.div
                                    layoutId={`opp-${drawingOppCard.id}`}
                                    className="absolute w-8 h-12 rounded bg-gradient-to-br from-indigo-900 to-slate-900 border border-white/10 shadow-lg z-50"
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ opacity: 1 }}
                                    transition={{ duration: 0 }}
                                />
                            )}
                        </AnimatePresence>

                        <div className="relative w-20 h-28 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg border-2 border-white/20 shadow-xl flex items-center justify-center cursor-pointer active:scale-95 transition-transform rotate-6 hover:rotate-0 hover:scale-105">
                            {/* Deck Texture */}
                            <div className="w-14 h-20 border border-white/10 rounded flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary/50 text-3xl">style</span>
                            </div>
                        </div>
                    </div>

                    {/* Player Slot */}
                    <div className="w-32 h-44 rounded-xl border-2 border-primary/30 bg-primary/5 flex items-center justify-center relative shadow-[0_0_15px_rgba(249,245,6,0.1)] overflow-hidden">
                        <AnimatePresence mode='wait'>
                            {playerFieldCard ? (
                                <motion.div
                                    key="player-field"
                                    layoutId={playerFieldCard.id} // Hand에서 Field로 자연스러운 이동 (Shared Layout)
                                    className="absolute inset-0"
                                >
                                    <div
                                        className="absolute inset-0 bg-cover bg-center"
                                        style={{ backgroundImage: `url('${playerFieldCard.image}')` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
                                    </div>
                                    <div className="absolute bottom-2 left-0 w-full flex flex-col items-center z-10 px-1">
                                        <span className="text-white font-bold text-sm shadow-black drop-shadow-md truncate w-full text-center mb-1">{playerFieldCard.name}</span>
                                        <div className="flex justify-center items-center gap-1 w-full">
                                            <div className="flex items-center gap-0.5 bg-red-900/80 px-1.5 py-0.5 rounded border border-red-500/50 backdrop-blur-sm">
                                                <span className="material-symbols-outlined text-red-500 text-[10px]">favorite</span>
                                                <span className="text-white text-[10px] font-bold">{playerFieldCard.hp}</span>
                                            </div>
                                            <div className="flex items-center gap-0.5 bg-yellow-900/80 px-1.5 py-0.5 rounded border border-yellow-500/50 backdrop-blur-sm">
                                                <span className="material-symbols-outlined text-yellow-500 text-[10px]">flash_on</span>
                                                <span className="text-white text-[10px] font-bold">{playerFieldCard.attack}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.p
                                    key="player-empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-primary/40 text-sm font-heading tracking-widest text-center leading-tight"
                                >
                                    배틀<br />구역
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Turn Indicator */}
                <div className={`absolute top-[45%] right-4 flex flex-col items-center gap-1 ${turnIndicator === 'player' ? 'animate-bounce opacity-100' : 'opacity-0'}`}>
                    <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">당신 차례</span>
                    <span className="material-symbols-outlined text-primary text-xl">keyboard_double_arrow_down</span>
                </div>
            </div>

            {/* Player Area (Bottom) */}
            <div className="relative z-20 w-full flex flex-col justify-end pb-6 pt-12 bg-gradient-to-t from-[#15150a] via-[#15150a]/90 to-transparent">

                {/* Battle Button */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-30">
                    <button
                        onClick={handleBattleStart}
                        disabled={!selectedCardId || isBattling}
                        className={`flex items-center gap-2 text-black text-xl px-8 py-3 rounded-full shadow-[0_0_20px_rgba(249,245,6,0.4)] transition-all transform
                            ${selectedCardId && !isBattling ? 'bg-primary hover:scale-105 hover:bg-yellow-300 active:scale-95 cursor-pointer' : 'bg-gray-600 cursor-not-allowed opacity-50'}
                        `}
                    >
                        <span className="material-symbols-outlined">swords</span>
                        {isBattling ? '배틀 중...' : '배틀!'}
                    </button>
                </div>

                {/* Stats Row */}
                <div className="flex justify-between items-end px-4 mb-2">
                    <div className="flex flex-col">
                        <span className="text-white text-xs font-bold uppercase tracking-widest opacity-60">보유 카드</span>
                        <span className="text-primary text-sm font-bold">카드 {playerHand.length}장</span>
                    </div>
                    {/* Player HP Bar */}
                    <div className="flex flex-col items-end w-32">
                        <div className="flex justify-between w-full text-xs mb-1">
                            <span className="text-green-400 font-bold">HP</span>
                            <span className="text-white font-mono">{playerHp}/500</span>
                        </div>
                        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden border border-white/10">
                            <div
                                className="h-full bg-green-500 rounded-full transition-all duration-300"
                                style={{ width: `${(playerHp / 500) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Card Hand with AnimatePresence */}
                <div
                    ref={scrollContainerRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    className="flex overflow-x-auto gap-3 px-6 pb-4 pt-4 snap-x no-scrollbar items-end h-[240px] cursor-grab active:cursor-grabbing"
                >
                    <AnimatePresence mode='popLayout'>
                        {playerHand.map((card) => {
                            return (
                                <motion.div
                                    key={card.id}
                                    layoutId={card.id} // 덱에서부터 생성된 같은 ID의 카드와 연결됨
                                    onClick={() => !isDragging && handleCardSelect(card.id)}
                                    // initial/animate는 layoutId가 처리하므로 불필요하거나 최소화
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1, zIndex: selectedCardId === card.id ? 20 : 1 }}
                                    exit={{ scale: 0, opacity: 0, y: 50 }}
                                    transition={{
                                        duration: 0.6,
                                        type: "spring",
                                        bounce: 0.5
                                    }}
                                    className={`shrink-0 w-32 h-48 rounded-xl bg-card-surface border overflow-hidden relative group transition-colors duration-300 snap-center cursor-pointer select-none
                                        ${selectedCardId === card.id
                                            ? 'border-primary shadow-[0_0_15px_rgba(249,245,6,0.5)]'
                                            : 'border-white/10 hover:shadow-xl'
                                        }
                                    `}
                                    // 선택 시 위로 올라가는 효과는 transform 대신 margin/padding 혹은 y offset 사용해야 layout 깨짐 방지
                                    // 여기서는 선택된 상태를 animate prop의 y값으로 제어
                                    style={{ y: selectedCardId === card.id ? -24 : 0 }}
                                >
                                    <div
                                        className="h-28 w-full bg-cover bg-center pointer-events-none"
                                        style={{ backgroundImage: `url('${card.image}')` }}
                                    >
                                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-card-surface"></div>
                                    </div>
                                    <div className="p-2 pt-1 relative pointer-events-none flex flex-col items-center">
                                        <h3 className={`text-sm tracking-wide mb-1 truncate text-center w-full ${selectedCardId === card.id ? 'text-primary font-bold' : 'text-white'}`}>
                                            {card.name}
                                        </h3>
                                        <div className="flex justify-center items-center gap-2 w-full mb-1">
                                            <div className="flex items-center gap-0.5 bg-red-900/50 px-1.5 py-0.5 rounded border border-red-500/30">
                                                <span className="material-symbols-outlined text-red-500 text-[10px]">favorite</span>
                                                <span className="text-white text-[10px] font-bold">{card.hp}</span>
                                            </div>
                                            <div className="flex items-center gap-0.5 bg-yellow-900/50 px-1.5 py-0.5 rounded border border-yellow-500/30">
                                                <span className="material-symbols-outlined text-yellow-500 text-[10px]">flash_on</span>
                                                <span className="text-white text-[10px] font-bold">{card.attack}</span>
                                            </div>
                                        </div>
                                        <p className="text-[9px] text-gray-400 mt-0.5 leading-tight line-clamp-1 text-center w-full">{card.description}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default BattleScreen;
