import type { Card } from '../types';

export const INITIAL_PLAYER_CARDS: Card[] = [
    {
        id: 'c1',
        name: '파이로 리자드',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnMqvQObBy4U9T-3b2kRcJhyZovvGqS3uzKI0Dn-A980Dkp33lUHortiWkrk2WGw-ESF3XCCBw1oU-SzjToOrpoGEoUki9mzXb60Y3e5zsB48Z7--X0Qs9Gs3j6YWCtcH0oEe8cZQ-rQDE363lmXCgt3-wtbJMjPilmSspHbAwlrOQmQDYdMThLpM9wuYlS8n_BypXO2r5N6QWvlBO4bFiX2XIaP7Rxd_Bjcw5KyADQEie5IkplxYb954tnUyQ5F46vjn4aOm1ZFvL',
        hp: 120,
        attack: 45,
        description: '접촉 시 2라운드 동안 화상.',
        type: 'fire'
    }
];

export const ALL_CARDS: Card[] = [
    { id: '1', name: "이상해씨", hp: 45, attack: 49, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png", description: "씨앗포켓몬" },
    { id: '3', name: "이상해꽃", hp: 80, attack: 82, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png", description: "씨앗포켓몬" },
    { id: '4', name: "파이리", hp: 39, attack: 52, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png", description: "도마뱀포켓몬" },
    { id: '6', name: "리자몽", hp: 78, attack: 84, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png", description: "화염포켓몬" },
    { id: '7', name: "꼬부기", hp: 44, attack: 48, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png", description: "꼬마거북포켓몬" },
    { id: '9', name: "거북왕", hp: 79, attack: 83, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png", description: "껍질포켓몬" },
    { id: '25', name: "피카츄", hp: 35, attack: 55, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png", description: "쥐포켓몬" },
    { id: '26', name: "라이츄", hp: 60, attack: 90, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/26.png", description: "쥐포켓몬" },
    { id: '31', name: "니드퀸", hp: 90, attack: 92, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/31.png", description: "드릴포켓몬" },
    { id: '34', name: "니드킹", hp: 81, attack: 102, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/34.png", description: "드릴포켓몬" },
    { id: '39', name: "푸린", hp: 115, attack: 45, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png", description: "풍선포켓몬" },
    { id: '40', name: "푸크린", hp: 140, attack: 70, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/40.png", description: "풍선포켓몬" },
    { id: '52', name: "나옹", hp: 40, attack: 45, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/52.png", description: "요괴고양이포켓몬" },
    { id: '54', name: "고라파덕", hp: 50, attack: 52, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png", description: "오리포켓몬" },
    { id: '55', name: "골덕", hp: 80, attack: 82, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/55.png", description: "오리포켓몬" },
    { id: '58', name: "가디", hp: 55, attack: 70, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/58.png", description: "강아지포켓몬" },
    { id: '59', name: "윈디", hp: 90, attack: 110, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/59.png", description: "전설포켓몬" },
    { id: '62', name: "강챙이", hp: 90, attack: 95, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/62.png", description: "올챙이포켓몬" },
    { id: '65', name: "후딘", hp: 55, attack: 50, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/65.png", description: "초능력포켓몬" },
    { id: '68', name: "괴력몬", hp: 90, attack: 130, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/68.png", description: "슈퍼파워포켓몬" },
    { id: '76', name: "딱구리", hp: 80, attack: 120, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/76.png", description: "메가톤포켓몬" },
    { id: '79', name: "야돈", hp: 90, attack: 65, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/79.png", description: "얼간이포켓몬" },
    { id: '80', name: "야도란", hp: 95, attack: 75, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/80.png", description: "기생포켓몬" },
    { id: '91', name: "파르셀", hp: 50, attack: 95, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/91.png", description: "조개포켓몬" },
    { id: '94', name: "팬텀", hp: 60, attack: 65, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png", description: "그림자포켓몬" },
    { id: '95', name: "롱스톤", hp: 35, attack: 45, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/95.png", description: "돌뱀포켓몬" },
    { id: '103', name: "나시", hp: 95, attack: 95, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/103.png", description: "야자열매포켓몬" },
    { id: '106', name: "시라소몬", hp: 50, attack: 120, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/106.png", description: "킥포켓몬" },
    { id: '107', name: "홍수몬", hp: 50, attack: 105, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/107.png", description: "펀치포켓몬" },
    { id: '112', name: "코뿌리", hp: 105, attack: 130, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/112.png", description: "드릴포켓몬" },
    { id: '113', name: "럭키", hp: 250, attack: 5, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/113.png", description: "알포켓몬" },
    { id: '123', name: "스라크", hp: 70, attack: 110, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/123.png", description: "버섯포켓몬" },
    { id: '127', name: "쁘사이저", hp: 65, attack: 125, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/127.png", description: "사슴벌레포켓몬" },
    { id: '129', name: "잉어킹", hp: 20, attack: 10, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/129.png", description: "물고기포켓몬" },
    { id: '130', name: "갸라도스", hp: 95, attack: 125, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/130.png", description: "흉악포켓몬" },
    { id: '131', name: "라프라스", hp: 130, attack: 85, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/131.png", description: "탈것포켓몬" },
    { id: '132', name: "메타몽", hp: 48, attack: 48, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png", description: "변신포켓몬" },
    { id: '133', name: "이브이", hp: 55, attack: 55, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png", description: "진화포켓몬" },
    { id: '134', name: "샤미드", hp: 130, attack: 65, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/134.png", description: "거품뿜기포켓몬" },
    { id: '135', name: "쥬피썬더", hp: 65, attack: 65, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/135.png", description: "번개포켓몬" },
    { id: '136', name: "부스터", hp: 65, attack: 130, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/136.png", description: "불꽃포켓몬" },
    { id: '142', name: "프테라", hp: 80, attack: 105, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/142.png", description: "화석포켓몬" },
    { id: '143', name: "잠만보", hp: 160, attack: 110, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png", description: "졸음포켓몬" },
    { id: '144', name: "프리져", hp: 90, attack: 85, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/144.png", description: "냉동포켓몬" },
    { id: '145', name: "썬더", hp: 90, attack: 90, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/145.png", description: "전기포켓몬" },
    { id: '146', name: "파이어", hp: 90, attack: 100, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/146.png", description: "화염포켓몬" },
    { id: '147', name: "미뇽", hp: 41, attack: 64, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/147.png", description: "용포켓몬" },
    { id: '149', name: "망나뇽", hp: 91, attack: 134, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png", description: "용포켓몬" },
    { id: '150', name: "뮤츠", hp: 106, attack: 110, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png", description: "유전포켓몬" },
    { id: '151', name: "뮤", hp: 100, attack: 100, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png", description: "신종포켓몬" }
];

// 게임 시작 시 50장 중 랜덤하게 뽑아 쓸 수 있도록 내보냄
export const getRandomCards = (count: number): Card[] => {
    const shuffled = [...ALL_CARDS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(card => ({
        ...card,
        id: `${card.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` // 고유 ID 생성
    }));
};

export const getRandomCard = (): Card => {
    const random = ALL_CARDS[Math.floor(Math.random() * ALL_CARDS.length)];
    return {
        ...random,
        id: `${random.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
};
