const swipeSound = new Audio('/sounds/swipe.mp3');
const voteSound = new Audio('/sounds/vote.mp3');
const shareSound = new Audio('/sounds/share.mp3');

export const playSoundEffect = (effect) => {
  switch (effect) {
    case 'swipe':
      swipeSound.play();
      break;
    case 'vote':
      voteSound.play();
      break;
    case 'share':
      shareSound.play();
      break;
    default:
      console.warn('Unknown sound effect:', effect);
  }
};