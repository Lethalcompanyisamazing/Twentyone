const suits = ["♠", "♥", "♦", "♣"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
let deck, playerHand, dealerHand;
const hitButton = document.getElementById("hit");
const standButton = document.getElementById("stand");
const restartButton = document.getElementById("restart");

restartButton.addEventListener("click", startGame);
hitButton.addEventListener("click", playerHit);
standButton.addEventListener("click", playerStand);

function createDeck() {
    let deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    return deck.sort(() => Math.random() - 0.5);
}

function getCardValue(card) {
    if (["J", "Q", "K"].includes(card.value)) return 10;
    if (card.value === "A") return 11;
    return parseInt(card.value);
}

function calculateHandValue(hand) {
    let value = hand.reduce((sum, card) => sum + getCardValue(card), 0);
    let aces = hand.filter(card => card.value === "A").length;

    while (value > 21 && aces) {
        value -= 10;
        aces--;
    }

    return value;
}

function dealCard(hand) {
    hand.push(deck.pop());
}

function updateUI() {
    document.getElementById("player-hand").innerHTML = playerHand.map(card => `<span class="card">${card.value}${card.suit}</span>`).join("");
    document.getElementById("dealer-hand").innerHTML = dealerHand.map(card => `<span class="card">${card.value}${card.suit}</span>`).join("");
    document.getElementById("status").textContent = `Your total: ${calculateHandValue(playerHand)}`;
}

function playerHit() {
    dealCard(playerHand);
    updateUI();

    if (calculateHandValue(playerHand) > 21) {
        document.getElementById("status").textContent = "You busted! Dealer wins.";
        disableButtons();
    }
}

function playerStand() {
    disableButtons();
    dealerTurn();
}

function dealerTurn() {
    while (calculateHandValue(dealerHand) < 17) {
        dealCard(dealerHand);
    }

    updateUI();
    checkWinner();
}

function checkWinner() {
    const playerTotal = calculateHandValue(playerHand);
    const dealerTotal = calculateHandValue(dealerHand);

    if (dealerTotal > 21 || playerTotal > dealerTotal) {
        document.getElementById("status").textContent = "You win!";
    } else if (playerTotal < dealerTotal) {
        document.getElementById("status").textContent = "Dealer wins!";
    } else {
        document.getElementById("status").textContent = "It's a tie!";
    }
}

function disableButtons() {
    hitButton.disabled = true;
    standButton.disabled = true;
}

function startGame() {
    deck = createDeck();
    playerHand = [];
    dealerHand = [];

    dealCard(playerHand);
    dealCard(dealerHand);
    dealCard(playerHand);
    dealCard(dealerHand);

    hitButton.disabled = false;
    standButton.disabled = false;

    updateUI();
}

startGame();
