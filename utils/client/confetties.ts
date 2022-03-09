import confetti from 'canvas-confetti'

const fireworks = (duration = 2000) => {
  var animationEnd = Date.now() + duration
  var defaults = { startVelocity: 30, spread: 360, ticks: 120, zIndex: 100000 }

  function randomInRange (min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  const interval = (setInterval(function () {
    var timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    var particleCount = 150 * (timeLeft / duration)
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
    )
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    )
  }, 250) as unknown) as number
}

const exports = {
  fireworks,
}

export default exports
