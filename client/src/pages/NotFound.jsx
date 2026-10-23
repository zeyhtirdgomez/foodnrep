import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import runnerSpriteUrl from "../assets/runner.png";
import proteinShakeSpriteUrl from "../assets/proteinshake.png";
import dumbbellSpriteUrl from "../assets/dumbell.png";
import chickenSpriteUrl from "../assets/chicken.png";
import "../css/NotFound.css";

const GAME_WIDTH = 900;
const GAME_HEIGHT = 280;
const GROUND_Y = 230;
const PLAYER_X = 105;
const PLAYER_HEIGHT = 94;
const RUNNER_SIZE = 150;
const PLAYER_COLLISION_LEFT = PLAYER_X - 20;
const PLAYER_COLLISION_RIGHT = PLAYER_X + 75;
const SPRITE_URLS = {
    runner: runnerSpriteUrl,
    proteinShake: proteinShakeSpriteUrl,
    dumbbell: dumbbellSpriteUrl,
    chicken: chickenSpriteUrl
};

const createGame = () => ({
    playerY: 0,
    velocityY: 0,
    obstacles: [],
    chicken: [],
    elapsed: 0,
    distance: 0,
    chickens: 0,
    nextObstacle: 1.1,
    nextChicken: 1.8,
    speed: 330
});

const drawGame = (canvas, game, sprites) => {
    const context = canvas?.getContext("2d");
    if (!context) return;

    const { width, height } = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    const pixelWidth = Math.round(width * ratio);
    const pixelHeight = Math.round(height * ratio);
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
    }

    context.setTransform(pixelWidth / GAME_WIDTH, 0, 0, pixelHeight / GAME_HEIGHT, 0, 0);
    context.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    const wall = context.createLinearGradient(0, 0, 0, 195);
    wall.addColorStop(0, "#d9e6df");
    wall.addColorStop(1, "#f2e8d8");
    context.fillStyle = wall;
    context.fillRect(0, 0, GAME_WIDTH, GROUND_Y);

    context.fillStyle = "#c5d7cd";
    context.beginPath();
    context.moveTo(0, 183);
    context.lineTo(0, 150);
    context.quadraticCurveTo(450, 110, GAME_WIDTH, 150);
    context.lineTo(GAME_WIDTH, 183);
    context.fill();

    for (let x = 42; x < GAME_WIDTH; x += 226) {
        context.fillStyle = "#f8f6ed";
        context.fillRect(x, 36, 152, 91);
        context.fillStyle = "#a8c7c6";
        context.fillRect(x + 6, 42, 140, 79);
        context.fillStyle = "rgba(255, 255, 255, 0.58)";
        context.fillRect(x + 16, 48, 44, 67);
        context.fillStyle = "#f8f6ed";
        context.fillRect(x + 75, 42, 5, 79);
        context.fillRect(x + 6, 78, 140, 5);
    }

    context.fillStyle = "#d7c5aa";
    context.fillRect(0, 177, GAME_WIDTH, 7);
    context.fillStyle = "#b78e66";
    context.fillRect(0, 184, GAME_WIDTH, 8);

    context.fillStyle = "#766957";
    context.fillRect(0, 192, GAME_WIDTH, GAME_HEIGHT - 192);
    const floorOffset = (game.distance * 0.65) % 74;
    for (let x = -74; x < GAME_WIDTH; x += 74) {
        context.fillStyle = "rgba(255, 255, 255, 0.09)";
        context.fillRect(x - floorOffset, 194, 36, GAME_HEIGHT - 194);
    }
    context.fillStyle = "#6d835f";
    context.fillRect(0, GROUND_Y - 3, GAME_WIDTH, 7);
    context.fillStyle = "#acc08e";
    context.fillRect(0, GROUND_Y - 3, GAME_WIDTH, 2);

    context.fillStyle = "rgba(38, 43, 37, 0.12)";
    context.beginPath();
    context.ellipse(PLAYER_X + 23, GROUND_Y + 3, 37, 6, 0, 0, Math.PI * 2);
    context.fill();

    if (sprites.runner) {
        context.drawImage(
            sprites.runner,
            PLAYER_X + 24 - RUNNER_SIZE * 0.52,
            GROUND_Y - RUNNER_SIZE * 0.77 - game.playerY,
            RUNNER_SIZE,
            RUNNER_SIZE
        );
    }

    game.obstacles.forEach(({ x, type }) => {
        const sprite = sprites[type];
        const size = type === "proteinShake" ? 86 : 104;
        if (sprite) {
            context.drawImage(sprite, x - size / 2, GROUND_Y - size * 0.84, size, size);
        }
    });

    game.chicken.forEach(({ x, y }) => {
        if (sprites.chicken) {
            const bob = Math.sin(game.elapsed * 5 + x / 36) * 4;
            context.drawImage(sprites.chicken, x - 30, y - 30 + bob, 60, 60);
        }
    });
};

const NotFound = () => {
    const canvasRef = useRef(null);
    const gameRef = useRef(createGame());
    const [phase, setPhase] = useState("ready");
    const [score, setScore] = useState(0);
    const [chickens, setChickens] = useState(0);
    const [sprites, setSprites] = useState({});
    const [spriteErrors, setSpriteErrors] = useState([]);

    useEffect(() => {
        let active = true;
        const loadedSprites = {};
        const failedSprites = [];

        Promise.all(Object.entries(SPRITE_URLS).map(([name, url]) =>
            new Promise((resolve) => {
                const image = new Image();
                image.onload = () => {
                    loadedSprites[name] = image;
                    resolve();
                };
                image.onerror = () => {
                    failedSprites.push(name);
                    resolve();
                };
                image.src = url;
            })
        )).then(() => {
            if (!active) return;
            setSprites(loadedSprites);
            setSpriteErrors(failedSprites);
        });

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return undefined;

        let frameId;
        let previousTime = 0;
        let lastScoreUpdate = 0;
        drawGame(canvas, gameRef.current, sprites);

        if (phase !== "running" || !sprites.runner) return undefined;

        const tick = (time) => {
            const game = gameRef.current;
            const delta = Math.min((time - (previousTime || time)) / 1000, 0.04);
            previousTime = time;
            game.elapsed += delta;
            game.distance += game.speed * delta;
            game.speed = Math.min(500, 330 + game.elapsed * 5);
            game.playerY += game.velocityY * delta;
            game.velocityY -= 1900 * delta;

            if (game.playerY <= 0) {
                game.playerY = 0;
                game.velocityY = 0;
            }

            const availableObstacles = ["dumbbell", "proteinShake"]
                .filter((type) => sprites[type]);
            if (availableObstacles.length > 0 && game.elapsed >= game.nextObstacle) {
                game.obstacles.push({
                    x: GAME_WIDTH + 40,
                    type: availableObstacles[Math.floor(Math.random() * availableObstacles.length)]
                });
                game.nextObstacle = game.elapsed + 1.25 + Math.random() * 0.65;
            }

            if (sprites.chicken && game.elapsed >= game.nextChicken) {
                game.chicken.push({
                    x: GAME_WIDTH + 25,
                    y: 120 + Math.random() * 40
                });
                game.nextChicken = game.elapsed + 1.8 + Math.random() * 1.3;
            }

            game.obstacles = game.obstacles
                .map((obstacle) => ({ ...obstacle, x: obstacle.x - game.speed * delta }))
                .filter((obstacle) => obstacle.x > -55);
            game.chicken = game.chicken
                .map((item) => ({ ...item, x: item.x - game.speed * delta }))
                .filter((item) => item.x > -25);

            const playerTop = GROUND_Y - PLAYER_HEIGHT - game.playerY;
            const collision = game.obstacles.some(({ x }) =>
                PLAYER_COLLISION_RIGHT > x - 25 &&
                PLAYER_COLLISION_LEFT < x + 25 &&
                playerTop + PLAYER_HEIGHT > GROUND_Y - 39
            );

            const collectedChicken = game.chicken.filter(({ x, y }) =>
                Math.abs(x - (PLAYER_X + 24)) < 38 &&
                Math.abs(y - (playerTop + 45)) < 48
            ).length;
            if (collectedChicken > 0) {
                game.chickens += collectedChicken;
                game.chicken = game.chicken.filter(({ x, y }) =>
                    !(Math.abs(x - (PLAYER_X + 24)) < 38 &&
                        Math.abs(y - (playerTop + 45)) < 48)
                );
                setChickens(game.chickens);
            }

            if (time - lastScoreUpdate > 100) {
                setScore(Math.floor(game.distance / 10) + game.chickens * 50);
                lastScoreUpdate = time;
            }

            drawGame(canvas, game, sprites);

            if (collision) {
                setScore(Math.floor(game.distance / 10) + game.chickens * 50);
                setPhase("over");
                return;
            }

            frameId = window.requestAnimationFrame(tick);
        };

        frameId = window.requestAnimationFrame(tick);
        return () => window.cancelAnimationFrame(frameId);
    }, [phase, sprites]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.code !== "Space" && event.code !== "ArrowUp" && event.code !== "KeyW") {
                return;
            }
            if (phase !== "running") return;
            event.preventDefault();
            if (phase === "running" && gameRef.current.playerY === 0) {
                gameRef.current.velocityY = 690;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [phase]);

    const startGame = () => {
        if (!sprites.runner) return;
        gameRef.current = createGame();
        setScore(0);
        setChickens(0);
        setPhase("running");
    };

    const jump = () => {
        if (phase === "running" && gameRef.current.playerY === 0) {
            gameRef.current.velocityY = 690;
        }
    };

    return (
        <main className="not-found-page">
            <header className="not-found-header">
                <Link className="not-found-brand" to="/" aria-label="FoodnRep home">
                    <span className="not-found-brand-mark" aria-hidden="true">f</span>
                    <span>food<span>n</span>rep</span>
                </Link>
                <span className="not-found-code">ERROR 404</span>
            </header>

            <section className="not-found-content" aria-labelledby="not-found-title">
                <div className="not-found-copy">
                    <span className="not-found-kicker">WELL, THAT'S A DETOUR</span>
                    <h1 id="not-found-title">This page wandered off.</h1>
                    <p>
                        While we get you back on track, try a quick round of Snack Sprint:
                        jump over gym gear and collect a chicken snack.
                    </p>
                </div>

                <section className="snack-game" aria-label="Snack Sprint mini-game">
                    <div className="snack-game-heading">
                        <div>
                            <span className="not-found-kicker">THE MINI WORKOUT</span>
                            <h2>Snack Sprint</h2>
                        </div>
                        <div className="snack-game-stats" aria-live="polite">
                            <span>Score <strong>{score}</strong></span>
                            <span className="snack-game-chicken-stat">
                                <img src={chickenSpriteUrl} alt="" />
                                <strong>{chickens}</strong>
                            </span>
                        </div>
                    </div>

                    <div className="snack-game-frame">
                        <canvas
                            ref={canvasRef}
                            className="snack-game-canvas"
                            width={GAME_WIDTH}
                            height={GAME_HEIGHT}
                            aria-label="A runner dodges a dumbbell and protein shaker while collecting chicken snacks."
                            onPointerDown={jump}
                        />
                        {phase !== "running" && (
                            <div className="snack-game-overlay">
                                <span className="snack-game-status-mark" aria-hidden="true">
                                    {phase === "over" ? "FINISH" : "READY"}
                                </span>
                                <p>
                                    {phase === "over"
                                        ? `Nice run! You scored ${score}.`
                                        : "Ready, set, snack!"}
                                </p>
                                <button
                                    type="button"
                                    onClick={startGame}
                                    disabled={!sprites.runner}
                                >
                                    {sprites.runner
                                        ? phase === "over" ? "Run again" : "Start running"
                                        : "Loading sprites..."}
                                </button>
                            </div>
                        )}
                    </div>
                    {spriteErrors.length > 0 && (
                        <p className="snack-game-asset-error" role="alert">
                            Could not load these game sprites: {spriteErrors.join(", ")}.
                        </p>
                    )}
                    {Object.keys(sprites).length === 0 && spriteErrors.length === 0 && (
                        <p className="snack-game-asset-status" role="status">
                            Loading game sprites...
                        </p>
                    )}
                    <p className="snack-game-instructions">
                        Press <kbd>Space</kbd> or <kbd>↑</kbd> to jump. On a phone, tap the game.
                        Collect chicken snacks for bonus points.
                    </p>
                </section>

                <nav className="not-found-actions" aria-label="Helpful links">
                    <Link className="not-found-primary" to="/dashboard">Back to dashboard</Link>
                    <Link className="not-found-secondary" to="/">Go to sign in</Link>
                </nav>
            </section>
            <footer className="not-found-footer">Move a little. Nourish a lot.</footer>
        </main>
    );
};

export default NotFound;