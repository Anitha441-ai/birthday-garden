import { puzzle1 } from "./data/puzzles";
import { useState,useEffect,useRef, } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";


function Petals() {
  const petals = [
    { left: "8%", delay: "0s", duration: "9s", size: "18px" },
    { left: "20%", delay: "2s", duration: "11s", size: "14px" },
    { left: "35%", delay: "5s", duration: "8s", size: "20px" },
    { left: "52%", delay: "1s", duration: "10s", size: "16px" },
    { left: "68%", delay: "4s", duration: "12s", size: "15px" },
    { left: "82%", delay: "3s", duration: "9s", size: "19px" },
    { left: "94%", delay: "6s", duration: "11s", size: "14px" },
  ];

  return (
    <div className="petals" aria-hidden="true">
      {petals.map((petal, index) => (
        <span
          key={index}
          className="petal"
          style={{
            left: petal.left,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            fontSize: petal.size,
          }}
        >
          ✿
        </span>
      ))}
    </div>
  );
}

function Sparkles() {
  const sparkles = [
    { left: "18%", top: "25%", delay: "0s" },
    { left: "78%", top: "30%", delay: "0.8s" },
    { left: "24%", top: "70%", delay: "1.5s" },
    { left: "82%", top: "68%", delay: "2.2s" },
  ];

  return (
    <div className="sparkles" aria-hidden="true">
      {sparkles.map((sparkle, index) => (
        <motion.span
          key={index}
          className="sparkle"
          style={{
            left: sparkle.left,
            top: sparkle.top,
          }}
          animate={{
            opacity: [0.15, 0.8, 0.15],
            scale: [0.7, 1.2, 0.7],
          }}
          transition={{
            duration: 2.5,
            delay: parseFloat(sparkle.delay),
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          ✦
        </motion.span>
      ))}
    </div>
  );
}

function WelcomeScreen({ onStart }) {
  return (
    <motion.section
      className="welcome-card"
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -35, scale: 0.98 }}
      transition={{
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.div
        className="flower"
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          delay: 0.35,
          duration: 0.8,
          type: "spring",
          stiffness: 100,
        }}
      >
        🌸
      </motion.div>

      <motion.p
        className="eyebrow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        A little birthday surprise
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8 }}
      >
        Something beautiful
        <br />
        is growing…
      </motion.h1>

      <motion.p
        className="description"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
      >
        I made a tiny little world
        <br />
        just for you. 🌿
      </motion.p>

      <motion.button
        className="start-button"
        onClick={onStart}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7, duration: 0.7 }}
        whileHover={{
          scale: 1.04,
          y: -3,
        }}
        whileTap={{
          scale: 0.97,
        }}
      >
        <span>✨</span>
        LET'S GO
        <span>🌸</span>
      </motion.button>

      <motion.p
        className="tiny-note"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.1 }}
      >
        A little adventure awaits…
      </motion.p>
    </motion.section>
  );
}
function UnlockScreen({ onUnlock }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!password.trim() || loading) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://vexwnjktykpjbqshfvfs.supabase.co/functions/v1/birthday-access",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: password.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.error === "Incorrect password"
            ? "Hmm… that's not our little secret 🤭"
            : "Something went wrong. Try again in a moment."
        );

        setShaking(true);

        setTimeout(() => {
          setShaking(false);
        }, 500);

        return;
      }

      /*
       * Password verified successfully.
       *
       * The Edge Function has already generated
       * a temporary signed URL for 1.jpg.
       *
       * We don't store the password, hash or salt
       * anywhere in the frontend.
       */

      setError("");
      setUnlocking(true);

      setTimeout(() => {
        onUnlock(data);
      }, 1200);

    } catch (error) {

      console.error(
        "Birthday access error:",
        error
      );

      setError(
        "I couldn't open the little garden. Please try again."
      );

      setShaking(true);

      setTimeout(() => {
        setShaking(false);
      }, 500);

    } finally {
      setLoading(false);
    }
  };


  return (
    <motion.section
      className={`welcome-card unlock-card ${
        shaking ? "shake" : ""
      }`}
      initial={{
        opacity: 0,
        y: 35,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -35,
        scale: 0.98,
      }}
      transition={{
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
      }}
    >

      {/* =====================================
          SUCCESS OVERLAY
      ===================================== */}

      <AnimatePresence>
        {unlocking && (
          <motion.div
            className="unlock-overlay"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
          >

            <motion.div
              className="unlock-heart"
              initial={{
                scale: 0,
              }}
              animate={{
                scale: [0, 1.2, 1],
              }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
              }}
            >
              🌸
            </motion.div>

            <motion.p
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.35,
              }}
            >
              You remembered. ❤️
            </motion.p>

          </motion.div>
        )}
      </AnimatePresence>


      {/* =====================================
          LOCK ICON
      ===================================== */}

      <motion.div
        className="lock-icon"
        animate={{
          y: [0, -4, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🔐
      </motion.div>


      <p className="eyebrow">
        A LITTLE SECRET
      </p>


      <h1>
        Something special
        <br />
        is waiting for you…
      </h1>


      <p className="description">
        Before you enter this little world,
        <br />
        there's one secret you need to know. 🌿
      </p>


      <p className="unlock-instruction">
        Enter the little word hidden
        <br />
        somewhere in your gift.
      </p>


      {/* =====================================
          PASSWORD FORM
      ===================================== */}

      <form
        className="unlock-form"
        onSubmit={handleSubmit}
      >

        <input
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setError("");
          }}
          placeholder="Enter the secret word"
          autoComplete="off"
          autoFocus
          disabled={loading || unlocking}
        />


        <AnimatePresence mode="wait">

          {error && (
            <motion.p
              className="error-message"
              initial={{
                opacity: 0,
                y: -5,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -5,
              }}
            >
              {error}
            </motion.p>
          )}

        </AnimatePresence>


        <motion.button
          className="start-button"
          type="submit"
          disabled={
            loading ||
            unlocking ||
            !password.trim()
          }
          whileHover={{
            scale: 1.04,
            y: -3,
          }}
          whileTap={{
            scale: 0.97,
          }}
        >

          {loading ? (
            <>
              🌱 CHECKING…
            </>
          ) : unlocking ? (
            <>
              ✨ OPENING…
            </>
          ) : (
            <>
              🌸 UNLOCK
            </>
          )}

        </motion.button>

      </form>


      <p className="tiny-note">
        Some little adventures
        <br />
        are worth unlocking. ✨
      </p>

    </motion.section>
  );
}
function PuzzleOne({ onComplete }) {
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [shaking, setShaking] = useState(false);

  const handleSelect = (option) => {
    if (result === "correct") return;

    setSelected(option.id);
    setResult(null);
  };

  const checkAnswer = () => {
    if (!selected) return;

    const answer = puzzle1.options.find(
      (option) => option.id === selected
    );

    if (answer.correct) {
      setResult("correct");

      setTimeout(() => {
        onComplete();
      }, 1800);
    } else {
      setResult("wrong");
      setShaking(true);

      setTimeout(() => {
        setShaking(false);
      }, 500);
    }
  };

  return (
    <motion.section
      className={`welcome-card puzzle-card ${
        shaking ? "shake" : ""
      }`}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Celebration overlay */}
      <AnimatePresence>
        {result === "correct" && (
          <motion.div
            className="puzzle-success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="success-flower"
              initial={{
                scale: 0,
                rotate: -20,
              }}
              animate={{
                scale: [0, 1.2, 1],
                rotate: [0, 15, 0],
              }}
              transition={{
                duration: 0.8,
              }}
            >
              🌸
            </motion.div>

            <motion.h2
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.3,
              }}
            >
              You remembered! ❤️
            </motion.h2>

            <motion.p
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.5,
              }}
            >
              One little memory unlocked…
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="puzzle-number">
        01
      </div>

      <p className="eyebrow">
        LEVEL 2 · MEMORY #1
      </p>

      <h1 className="puzzle-title">
        {puzzle1.title}
      </h1>

      <p className="description puzzle-description">
        {puzzle1.description}
      </p>

      <div className="memory-options">
        {puzzle1.options.map((option) => {
          const isSelected =
            selected === option.id;

          return (
            <motion.button
              key={option.id}
              className={`memory-option ${
                isSelected ? "selected" : ""
              }`}
              onClick={() => handleSelect(option)}
              whileHover={{
                scale: 1.02,
                y: -2,
              }}
              whileTap={{
                scale: 0.98,
              }}
            >
              <span className="memory-letter">
                {option.id}
              </span>

              <span className="memory-content">
                <strong>
                  {option.title}
                </strong>

                <small>
                  {option.text}
                </small>
              </span>

              <span className="memory-check">
                {isSelected ? "✓" : "♡"}
              </span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {result === "wrong" && (
          <motion.div
            className="puzzle-feedback wrong"
            initial={{
              opacity: 0,
              y: 5,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
            }}
          >
            <span>🌱</span>
            Not quite… but you're close.
            <br />
            <small>{puzzle1.hint}</small>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className={`start-button puzzle-button ${
          !selected ? "disabled" : ""
        }`}
        onClick={checkAnswer}
        disabled={!selected}
        whileHover={
          selected
            ? {
                scale: 1.04,
                y: -3,
              }
            : {}
        }
        whileTap={
          selected
            ? {
                scale: 0.97,
              }
            : {}
        }
      >
        CHECK MEMORY ✨
      </motion.button>

      <p className="tiny-note">
        Some memories are meant to be remembered. 🌿
      </p>
    </motion.section>
  );
}
function PuzzleTwo({ onComplete }) {
  const [treeMoved, setTreeMoved] = useState(false);
  const [batFound, setBatFound] = useState(false);

  const [playerClicked, setPlayerClicked] =
    useState(false);
  const [ballFound, setBallFound] =
    useState(false);

  const [trophyFound, setTrophyFound] =
    useState(false);

  const [wrongClick, setWrongClick] =
    useState(false);

  const [completed, setCompleted] =
    useState(false);

  const foundCount =
    [batFound, ballFound, trophyFound]
      .filter(Boolean).length;


  /* =====================================================
     CHECK PUZZLE COMPLETION
  ===================================================== */

  useEffect(() => {
    if (
      batFound &&
      ballFound &&
      trophyFound &&
      !completed
    ) {
      setCompleted(true);

      setTimeout(() => {
        onComplete();
      }, 2500);
    }
  }, [
    batFound,
    ballFound,
    trophyFound,
    completed,
    onComplete,
  ]);


  /* =====================================================
     WRONG CLICK
  ===================================================== */

  const handleWrongClick = () => {
    if (completed) return;

    setWrongClick(true);

    setTimeout(() => {
      setWrongClick(false);
    }, 700);
  };


  /* =====================================================
     TREE
  ===================================================== */

  const handleTreeClick = (event) => {
    event.stopPropagation();

    if (treeMoved) return;

    setTreeMoved(true);
  };


  /* =====================================================
     BAT
  ===================================================== */

  const handleBatClick = (event) => {
    event.stopPropagation();

    if (!treeMoved || batFound) return;

    setBatFound(true);
  };


  /* =====================================================
     PLAYER
  ===================================================== */

  const handlePlayerClick = (event) => {
    event.stopPropagation();

    if (playerClicked || ballFound) return;

    setPlayerClicked(true);
  };


  /* =====================================================
     BALL
  ===================================================== */

  const handleBallClick = (event) => {
    event.stopPropagation();

    if (
      !playerClicked ||
      ballFound
    ) {
      return;
    }

    setBallFound(true);
  };


  /* =====================================================
     TROPHY
  ===================================================== */

  const handleTrophyClick = (event) => {
    event.stopPropagation();

    if (trophyFound) return;

    setTrophyFound(true);
  };


  return (
    <motion.section
      className={`welcome-card puzzle-two-card ${
        wrongClick
          ? "wrong-scene-card"
          : ""
      }`}
      initial={{
        opacity: 0,
        x: 40,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: -40,
      }}
      transition={{
        duration: 0.8,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
    >

      {/* =================================================
          SUCCESS SCREEN
      ================================================= */}

      <AnimatePresence>
        {completed && (
          <motion.div
            className="cricket-complete-overlay"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
          >

            <motion.div
              className="cricket-complete-icon"
              initial={{
                scale: 0,
                rotate: -20,
              }}
              animate={{
                scale: [
                  0,
                  1.25,
                  1,
                ],
                rotate: [
                  -20,
                  10,
                  -5,
                  0,
                ],
              }}
              transition={{
                duration: 0.9,
              }}
            >
              🏆
            </motion.div>

            <motion.h2
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.3,
              }}
            >
              Well played! ❤️
            </motion.h2>

            <motion.p
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.55,
              }}
            >
              You found all three.
              <br />
              Looks like you've still
              got your cricket instincts. 😉
            </motion.p>

          </motion.div>
        )}
      </AnimatePresence>


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="puzzle-number">
        02
      </div>

      <p className="eyebrow">
        LEVEL 3 · THE HIDDEN CRICKET GROUND
      </p>

      <h1 className="puzzle-title">
        Find the 3 little things
        <br />
        hidden in this ground.
      </h1>

      <p className="description puzzle-description">
        Look carefully...
        <br />
        some things aren't as obvious as they seem. 👀
      </p>


      {/* =================================================
          CRICKET SCENE
      ================================================= */}

      <div
        className="cricket-scene"
        onClick={handleWrongClick}
      >

        {/* =================================================
            SKY
        ================================================= */}

        <div className="cricket-sun">
          ☀️
        </div>

        <div className="cricket-cloud cricket-cloud-one">
          ☁️
        </div>

        <div className="cricket-cloud cricket-cloud-two">
          ☁️
        </div>


        {/* =================================================
            FIELD
        ================================================= */}

        <div className="cricket-field">

          <div className="cricket-boundary" />

          <div className="cricket-pitch">

            <div className="pitch-crease pitch-crease-top" />

            <div className="pitch-crease pitch-crease-bottom" />

            <div className="decorative-stumps">
              <span />
              <span />
              <span />
            </div>

          </div>

        </div>


        {/* =================================================
            GRASS
        ================================================= */}

        <div className="field-grass field-grass-one">
          🌱
        </div>

        <div className="field-grass field-grass-two">
          🌿
        </div>

        <div className="field-grass field-grass-three">
          🌱
        </div>


        {/* =================================================
            PUZZLE 1
            TREE HIDING BAT
        ================================================= */}

        {/* BAT — behind tree */}

        <motion.button
          className={`hidden-bat ${
            batFound
              ? "bat-found"
              : ""
          }`}
          onClick={handleBatClick}
          aria-label="Find the cricket bat"
          initial={{
            opacity: 0.9,
          }}
          animate={{
            opacity: batFound
              ? 1
              : treeMoved
              ? 1
              : 0.45,
          }}
        >
          <span className="bat-handle" />
          <span className="bat-blade" />

          {batFound && (
            <motion.span
              className="object-check"
              initial={{
                scale: 0,
              }}
              animate={{
                scale: 1,
              }}
            >
              ✓
            </motion.span>
          )}
        </motion.button>


        {/* TREE */}

        <motion.button
          className="puzzle-tree"
          onClick={handleTreeClick}
          aria-label="Move the tree"
          animate={{
            x: treeMoved
              ? 78
              : 0,
          }}
          transition={{
            duration: 0.8,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
        >

          <span className="tree-crown">
            🌳
          </span>

        </motion.button>


        {/* =================================================
            PUZZLE 2
            PLAYER HOLDING BALL
        ================================================= */}

        <motion.button
          className="cricket-player"
          onClick={handlePlayerClick}
          aria-label="Look at the cricket player"
          animate={
            playerClicked
              ? {
                  y: -4,
                }
              : {
                  y: [0, -2, 0],
                }
          }
          transition={
            playerClicked
              ? {
                  duration: 0.35,
                }
              : {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        >

          <span className="player-head">
            🙂
          </span>

          <span className="player-body">
            👕
          </span>

          <span className="player-legs">
            👖
          </span>

          {/* subtle ball before discovery */}

          {!ballFound && (
            <motion.span
              className={`player-hidden-ball ${
                playerClicked
                  ? "ball-revealed"
                  : ""
              }`}
              animate={
                playerClicked
                  ? {
                      scale: [
                        0.8,
                        1.25,
                        1,
                      ],
                    }
                  : {}
              }
              transition={{
                duration: 0.5,
              }}
            >
              🔴
            </motion.span>
          )}

        </motion.button>


        {/* =================================================
            BALL AFTER PLAYER INTERACTION
        ================================================= */}

        <AnimatePresence>
          {playerClicked &&
            !ballFound && (
              <motion.button
                className="revealed-cricket-ball"
                onClick={handleBallClick}
                aria-label="Find the cricket ball"
                initial={{
                  opacity: 0,
                  scale: 0.4,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0,
                }}
                transition={{
                  duration: 0.45,
                }}
              >
                <span className="ball-shape" />
              </motion.button>
            )}
        </AnimatePresence>


        {/* =================================================
            PUZZLE 3
            TROPHY IN GRASS
        ================================================= */}

        <motion.button
          className={`hidden-trophy ${
            trophyFound
              ? "trophy-found"
              : ""
          }`}
          onClick={handleTrophyClick}
          aria-label="Find the hidden trophy"
          animate={
            trophyFound
              ? {
                  y: -25,
                  scale: 1.15,
                  rotate: [
                    0,
                    -8,
                    8,
                    0,
                  ],
                }
              : {}
          }
          transition={{
            duration: 0.7,
          }}
        >

          <span className="trophy-grass">
            🌿
          </span>

          <span className="trophy-icon">
            🏆
          </span>

          {trophyFound && (
            <motion.span
              className="object-check"
              initial={{
                scale: 0,
              }}
              animate={{
                scale: 1,
              }}
            >
              ✓
            </motion.span>
          )}

        </motion.button>


        {/* =================================================
            SMALL DECORATIVE BENCH
        ================================================= */}

        <div className="cricket-bench">
          <span />
          <span />
        </div>

      </div>


      {/* =================================================
          PROGRESS
      ================================================= */}

      <div className="hidden-progress">

        <div
          className={`progress-item ${
            batFound
              ? "progress-found"
              : ""
          }`}
        >
          {batFound ? "✓" : "🏏"}
        </div>

        <div
          className={`progress-item ${
            ballFound
              ? "progress-found"
              : ""
          }`}
        >
          {ballFound ? "✓" : "🔴"}
        </div>

        <div
          className={`progress-item ${
            trophyFound
              ? "progress-found"
              : ""
          }`}
        >
          {trophyFound ? "✓" : "🏆"}
        </div>

      </div>


      {/* =================================================
          WRONG CLICK
      ================================================= */}

      <AnimatePresence>
        {wrongClick && (
          <motion.p
            className="cricket-hint"
            initial={{
              opacity: 0,
              y: 5,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -5,
            }}
          >
            Hmm... look a little closer. 👀
          </motion.p>
        )}
      </AnimatePresence>


      {/* =================================================
          FOOTER
      ================================================= */}

      <p className="tiny-note">
        {foundCount} of 3 found
        <br />
        Take your time... 🏏
      </p>

    </motion.section>
  );
}
function PuzzleThree({ onComplete }) {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(false);
  const [completed, setCompleted] = useState(false);

  const correctAnswer = "memories";

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleanedAnswer = answer
      .trim()
      .toLowerCase();

    if (cleanedAnswer === correctAnswer) {
      setError(false);
      setCompleted(true);

      setTimeout(() => {
        onComplete();
      }, 3500);

      return;
    }

    setError(true);

    setTimeout(() => {
      setError(false);
    }, 1200);
  };

  return (
    <motion.section
      className="welcome-card puzzle-three-card"
      initial={{
        opacity: 0,
        x: 40,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: -40,
      }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
    >

      {/* =====================================
          SUCCESS SCREEN
      ===================================== */}

      <AnimatePresence>
        {completed && (
          <motion.div
            className="puzzle-three-success"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
          >

            <motion.div
              className="memory-stars"
              initial={{
                scale: 0,
              }}
              animate={{
                scale: 1,
              }}
              transition={{
                duration: 0.8,
              }}
            >
              ✨
            </motion.div>

            <motion.h2
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.3,
              }}
            >
              You got it! ❤️
            </motion.h2>

            <motion.p
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.6,
              }}
            >
              Some memories are worth
              <br />
              keeping forever.
            </motion.p>

            <motion.div
              className="memory-box"
              initial={{
                scale: 0,
                rotate: -5,
              }}
              animate={{
                scale: [0, 1.1, 1],
                rotate: [0, 4, 0],
              }}
              transition={{
                delay: 1,
                duration: 1,
              }}
            >
              🎁
            </motion.div>

            <motion.p
              className="memory-coming"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 1.8,
              }}
            >
              There's one more thing waiting
              <br />
              for you...
            </motion.p>

          </motion.div>
        )}
      </AnimatePresence>


      {/* =====================================
          PUZZLE CONTENT
      ===================================== */}

      {!completed && (
        <>
          <div className="puzzle-number">
            03
          </div>

          <p className="eyebrow">
            LEVEL 4 · ONE LAST CLUE
          </p>

          <h1 className="puzzle-title">
            You've made it this far…
          </h1>

          <p className="description puzzle-description">
            Three little clues.
            <br />
            One little secret.
          </p>


          {/* =================================
              CLUE CARDS
          ================================= */}

          <div className="clue-container">

            {/* CLUE 1 */}

            <motion.div
              className="clue-card"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.2,
              }}
            >
              <div className="clue-icon">
                🌟
              </div>

              <p>
                Something that
                <br />
                stays with you.
              </p>
            </motion.div>


            {/* CLUE 2 */}

            <motion.div
              className="clue-card"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.4,
              }}
            >
              <div className="clue-icon">
                🏏
              </div>

              <p>
                Something that
                <br />
                brings a smile.
              </p>
            </motion.div>


            {/* CLUE 3 */}

            <motion.div
              className="clue-card"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.6,
              }}
            >
              <div className="clue-icon">
                🎓
              </div>

              <p>
                Something you've
                <br />
                worked for.
              </p>
            </motion.div>

          </div>


          <p className="question-text">
            What do they have in common?
          </p>


          {/* =================================
              ANSWER
          ================================= */}

          <form
            className={`final-answer-form ${
              error ? "answer-error" : ""
            }`}
            onSubmit={handleSubmit}
          >

            <input
              type="text"
              value={answer}
              onChange={(event) => {
                setAnswer(event.target.value);
                setError(false);
              }}
              placeholder="Type your answer..."
              autoComplete="off"
              spellCheck="false"
            />

            <button type="submit">
              UNLOCK
              <span>♥</span>
            </button>

          </form>


          <AnimatePresence>
            {error && (
              <motion.p
                className="wrong-answer"
                initial={{
                  opacity: 0,
                  y: -5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -5,
                }}
              >
                Not quite… think about what
                <br />
                makes moments special. ❤️
              </motion.p>
            )}
          </AnimatePresence>


          <p className="tiny-note">
            One word is all you need.
            <br />
            Take your time. 🌿
          </p>

        </>
      )}

    </motion.section>
  );
}
function MemoryStory({ onComplete, memoryUrls, }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [started, setStarted] = useState(false);
  const [showEnding, setShowEnding] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);

  const memories = [
    {
      image: "1.jpg",
      caption: "Where the story began...",
      duration: 4500,
      effect: "zoom-in",
    },
    {
      image: "2.jpg",
      caption: "A little moment from a beautiful childhood.",
      duration: 4000,
      effect: "zoom-out",
    },
    {
      image: "3.jpg",
      caption: "Those carefree days...",
      duration: 4000,
      effect: "zoom-in",
    },

    // Add the remaining memories here.
    // We will customize every caption later.

    {
      image: "4.jpg",
      caption: "A little memory worth keeping.",
      duration: 4000,
      effect: "zoom-out",
    },
    {
      image: "5.jpg",
      caption: "And the journey continued...",
      duration: 4000,
      effect: "zoom-in",
    },
    {
      image: "6.jpg",
      caption: "Growing, learning and discovering.",
      duration: 4000,
      effect: "zoom-out",
    },
    {
      image: "7.jpg",
      caption: "Another little chapter.",
      duration: 4000,
      effect: "zoom-in",
    },
    {
      image: "8.jpg",
      caption: "Some moments simply stay with us.",
      duration: 4000,
      effect: "zoom-out",
    },
    {
      image: "9.jpg",
      caption: "A memory from the journey.",
      duration: 4000,
      effect: "zoom-in",
    },
    {
      image: "10.jpg",
      caption: "And then came more adventures.",
      duration: 4000,
      effect: "zoom-out",
    },
    {
      image: "11.jpg",
      caption: "Growing into the person you were meant to be.",
      duration: 4000,
      effect: "zoom-in",
    },
    {
      image: "12.jpg",
      caption: "More memories. More stories.",
      duration: 4000,
      effect: "zoom-out",
    },
    {
      image: "13.jpg",
      caption: "The people and moments that mattered.",
      duration: 4000,
      effect: "zoom-in",
    },
    {
      image: "14.jpg",
      caption: "A chapter filled with smiles.",
      duration: 4000,
      effect: "zoom-out",
    },
    {
      image: "15.jpg",
      caption: "Life was slowly becoming a beautiful story.",
      duration: 4000,
      effect: "zoom-in",
    },
    {
      image: "16.jpg",
      caption: "And there was still so much ahead.",
      duration: 4000,
      effect: "zoom-out",
    },
    {
      image: "17.jpg",
      caption: "Friends, laughter and unforgettable days.",
      duration: 4000,
      effect: "zoom-in",
    },
    {
      image: "18.jpg",
      caption: "Some people become part of the story forever.",
      duration: 4000,
      effect: "zoom-out",
    },
    {
      image: "19.jpg",
      caption: "The moments that made the journey special.",
      duration: 4000,
      effect: "zoom-in",
    },
    {
      image: "20.jpg",
      caption: "A little more of the person you became.",
      duration: 4000,
      effect: "zoom-out",
    },
    {
      image: "21.jpg",
      caption: "Dreams slowly turning into reality.",
      duration: 4000,
      effect: "zoom-in",
    },
    {
      image: "22.jpg",
      caption: "Hard work. Growth. And a lot of memories.",
      duration: 4000,
      effect: "zoom-out",
    },
    {
      image: "23.jpg",
      caption: "Every achievement has a story behind it.",
      duration: 4000,
      effect: "zoom-in",
    },
    {
      image: "24.jpg",
      caption: "And every story has people who cheer for you.",
      duration: 4000,
      effect: "zoom-out",
    },
    {
      image: "25.jpg",
      caption: "Another milestone. Another memory.",
      duration: 4000,
      effect: "zoom-in",
    },
    {
      image: "26.jpg",
      caption: "Look at everything you've accomplished.",
      duration: 4000,
      effect: "zoom-out",
    },
    {
      image: "27.jpg",
      caption: "From then to now...",
      duration: 4000,
      effect: "zoom-in",
    },
    {
      image: "28.jpg",
      caption: "So many faces. So many moments.",
      duration: 4000,
      effect: "zoom-out",
    },
    {
      image: "29.jpg",
      caption: "And somehow, the best chapters are still ahead.",
      duration: 4000,
      effect: "zoom-in",
    },
    {
      image: "30.jpg",
      caption: "A life made beautiful by little moments.",
      duration: 4000,
      effect: "zoom-out",
    },
    {
      image: "31.jpg",
      caption: "Almost at the present...",
      duration: 4000,
      effect: "zoom-in",
    },
    {
      image: "32.jpg",
      caption: "Look how far you've come. ❤️",
      duration: 5500,
      effect: "zoom-out",
    },
  ];

  const currentMemory = memories[currentImage];

  /*
   * Start music
   */
  const startJourney = () => {
    setStarted(true);

    if (audioRef.current) {
      audioRef.current.volume = 0.35;

      audioRef.current
        .play()
        .catch(() => {
          console.log("Audio playback requires user interaction.");
        });
    }
  };

  /*
   * Toggle music
   */
  const toggleMute = () => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.volume = 0.35;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  /*
   * Move to next memory
   */
  const nextImage = () => {
    if (currentImage < memories.length - 1) {
      setCurrentImage((prev) => prev + 1);
    } else {
      setShowEnding(true);

      if (audioRef.current) {
        audioRef.current.volume = 0.2;
      }
    }
  };

  /*
   * Move backwards
   */
  const previousImage = () => {
    if (currentImage > 0) {
      setCurrentImage((prev) => prev - 1);
    }
  };

  /*
   * Automatic cinematic progression
   */
  useEffect(() => {
    if (!started || showEnding) return;

    const timer = setTimeout(() => {
      nextImage();
    }, currentMemory.duration);

    return () => clearTimeout(timer);
  }, [
    currentImage,
    started,
    showEnding,
  ]);

  /*
   * INTRO
   */
  if (!started) {
    return (
      <motion.section
        className="memory-intro cinematic-intro"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <audio
          ref={audioRef}
          src="/music/birthday.mp3"
          loop
          preload="auto"
        />

        <motion.div
          className="memory-gift"
          initial={{
            scale: 0,
            rotate: -10,
          }}
          animate={{
            scale: [0, 1.15, 1],
            rotate: [0, 8, 0],
          }}
          transition={{
            duration: 1,
          }}
        >
          🎁
        </motion.div>

        <motion.p
          className="memory-eyebrow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          A LITTLE SOMETHING FOR YOU
        </motion.p>

        <motion.h1
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.7,
          }}
        >
          Every life is made
          <br />
          of little moments...
        </motion.h1>

        <motion.p
          className="memory-intro-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          And here are a few of yours. ❤️
        </motion.p>

        <motion.button
          className="open-memory-button"
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 1.3,
          }}
          whileHover={{
            scale: 1.04,
          }}
          whileTap={{
            scale: 0.97,
          }}
          onClick={startJourney}
        >
          BEGIN THE JOURNEY
          <span>♥</span>
        </motion.button>

        <p className="music-note">
          🎵 A little music will play along the way
        </p>
      </motion.section>
    );
  }

  /*
   * ENDING
   */
  if (showEnding) {
    return (
      <motion.section
        className="memory-ending cinematic-ending"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="ending-sparkle"
          initial={{ scale: 0 }}
          animate={{
            scale: [0, 1.3, 1],
            rotate: [0, 20, -10, 0],
          }}
          transition={{
            duration: 1,
          }}
        >
          ✨
        </motion.div>

        <motion.p
          className="memory-eyebrow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          LOOK HOW FAR YOU'VE COME
        </motion.p>

        <motion.h1
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.7,
          }}
        >
          From little moments...
          <br />
          to a beautiful journey.
        </motion.h1>

        <motion.p
          className="ending-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          And this is only one chapter
          <br />
          of your story. ❤️
        </motion.p>

        <motion.button
          className="birthday-button"
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            delay: 1.7,
          }}
          onClick={onComplete}
        >
          CONTINUE
          <span>→</span>
        </motion.button>
      </motion.section>
    );
  }

  /*
   * CINEMATIC MEMORY VIEW
   */
  return (
    <motion.section
      className="memory-story cinematic-memory"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <audio
        ref={audioRef}
        src="/music/birthday.mp3"
        loop
      />

      <div className="memory-top-bar">
        <span>
          A LITTLE JOURNEY
        </span>

        <span>
          {currentImage + 1} / {memories.length}
        </span>
      </div>

      <div className="memory-progress">
        <motion.div
          className="memory-progress-fill"
          animate={{
            width: `${
              ((currentImage + 1) /
                memories.length) *
              100
            }%`,
          }}
        />
      </div>

      <div className="cinematic-frame">

        <AnimatePresence mode="wait">

          <motion.img
            key={currentMemory.image}
            src={memoryUrls[currentMemory.image]}
            alt={`Memory ${
              currentImage + 1
            }`}
            className={`memory-image cinematic-image ${
              currentMemory.effect ===
              "zoom-in"
                ? "cinematic-zoom-in"
                : "cinematic-zoom-out"
            }`}
            initial={{
              opacity: 0,
              scale: 1.08,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 1.02,
            }}
            transition={{
              duration: 1.1,
              ease: "easeInOut",
            }}
          />

        </AnimatePresence>

        <div className="cinematic-vignette" />

        <div className="cinematic-grain" />

        <AnimatePresence mode="wait">
          <motion.div
            key={`caption-${currentImage}`}
            className="cinematic-caption"
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            transition={{
              delay: 0.5,
              duration: 0.8,
            }}
          >
            {currentMemory.caption}
          </motion.div>
        </AnimatePresence>

      </div>

      <div className="memory-controls">

        <button
          className="memory-nav-button"
          onClick={previousImage}
          disabled={currentImage === 0}
        >
          ←
        </button>

        <p>
          {currentImage ===
          memories.length - 1
            ? "The final memory"
            : "A little piece of the journey"}
        </p>

        <button
          className="memory-nav-button"
          onClick={nextImage}
        >
          →
        </button>

      </div>

      <button
        className="music-control"
        onClick={toggleMute}
        aria-label="Toggle music"
      >
        {isMuted ? "🔇" : "🔊"}
      </button>

      <p className="memory-auto-note">
        Memories unfold automatically ✨
      </p>
    </motion.section>
  );
}
function App() {
  const [screen, setScreen] = useState("welcome");
  const [memoryUrls, setMemoryUrls] = useState({});

  return (
    <main className="app">
      <Petals />
      <Sparkles />

      <div className="glow glow-one" />
      <div className="glow glow-two" />

      <AnimatePresence mode="wait">
        {screen === "welcome" && (
          <WelcomeScreen
            key="welcome"
            onStart={() => setScreen("unlock")}
          />
        )}

        {screen === "unlock" && (
          <UnlockScreen
          key="unlock"
          onUnlock={(data) => {
            const urls = {};

            if (Array.isArray(data?.memories)) {
              data.memories.forEach((item) => {
                urls[item.path] = item.signedUrl;
              });
            }

            setMemoryUrls(urls);
            setScreen("puzzle1");
          }}
        />
        )}

        {screen === "puzzle1" && (
          <PuzzleOne
            key="puzzle1"
            onComplete={() => setScreen("puzzle2")}
          />
        )}
        {screen === "puzzle2" && (
          <PuzzleTwo
            key="puzzle2"
            onComplete={() => setScreen("puzzle3")}
          />
        )}

        {screen === "puzzle3" && (
          <PuzzleThree
            key="puzzle3"
            onComplete={() => setScreen("memory")}
          />
        )}
        {screen === "memory" && (
          <MemoryStory
            key="memory"
            memoryUrls={memoryUrls}
            onComplete={() => setScreen("birthday")}
          />
        )}
      </AnimatePresence>

      <div className="bottom-decoration" aria-hidden="true">
        🌿　🌱　🌿
      </div>
    </main>
  );
}

export default App;