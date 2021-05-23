<template>
  <div class="base-timer">
    <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g class="base-timer__circle">
        <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
        <path
          :stroke-dasharray="circleDasharray"
          class="base-timer__path-remaining"
          :class="remainingPathColor"
          d="
            M 50, 50
            m -45, 0
            a 45,45 0 1,0 90,0
            a 45,45 0 1,0 -90,0
          "
        ></path>
      </g>
    </svg>
    <span class="base-timer__modelabel">{{ currentMode }}</span>
    <span class="base-timer__label">{{ formattedTimeLeft }}</span>
    <span class="base-timer__setslabel">{{ setsLeft }} sets</span>
  </div>
</template>

<script>

import { Media } from '@ionic-native/media';

import { defineComponent } from "vue";

export default defineComponent({
  name: "TimerComponent",
  props: [
     'sets',
     'trainingtime',
     'breaktime'  
  ],
  data() {
    return {
      timeLimit: 0,
      timePassed: 0,
      timerInterval: null,
      setsLeft: 0,
      currentMode: "SETUP",
      sound: null,
    };
  },
  computed: {
    circleDasharray() {
      return `${(this.timeFraction * 283).toFixed(0)} 283`;
    },
    formattedTimeLeft() {
      const timeLeft = this.timeLeft;
      let minutes = Math.floor(timeLeft / 60);
      let seconds = timeLeft % 60;

      if (minutes < 10) {
        minutes = `0${minutes}`;
      }

      if (seconds < 10) {
        seconds = `0${seconds}`;
      }

      return `${minutes}:${seconds}`;
    },
    timeLeft() {
      return this.timeLimit - this.timePassed;
    },
    timeFraction() {
      const rawTimeFraction = this.timeLeft / this.timeLimit;
      return rawTimeFraction - (1 / this.timeLimit) * (1 - rawTimeFraction);
    },
    remainingPathColor() {
      if (this.timeLeft <= 5) {
        return "red";
      } else if (this.timeLeft <= 10) {
        return "orange";
      } else {
        return "green";
      }
    }
  },
  watch: {
    timeLeft(newValue) {
      if (newValue === 3) {
         this.sound.setVolume(1);
         this.sound.play();
      }

      if (newValue === 0) {
        this.onTimesUp();
      }
    }
  },
  methods: {
    onTimesUp() {
      clearInterval(this.timerInterval);
      if (this.currentMode == "TRAINING") {
         this.setsLeft--;
         this.currentMode = "BREAK";
         if (this.setsLeft > 0) {
          this.startTimer();
         } else {
           this.currentMode = "DONE";
         }
      } else {
        this.currentMode = "TRAINING";
        this.startTimer();
      }
    },
    startTimer() {
      if (this.currentMode == "TRAINING") {
        this.timeLimit = this.trainingtime;
      } else {
        this.timeLimit = this.breaktime;
      }
      this.timePassed = 0;
      this.timerInterval = setInterval(() => (this.timePassed += 1), 1000);
    },
    initialTimerStart() {
      this.timeLimit = 5;
      this.sound = Media.create("cdvfile://localhost/assets/public/assets/sounds/timer.wav"); 
      this.currentMode = "SETUP";
      this.setsLeft = this.sets;
      this.timePassed = 0;
      this.timerInterval = setInterval(() => (this.timePassed += 1), 1000);
    },
    pauseTimer() {
      if (this.currentMode != "DONE") {
        clearInterval(this.timerInterval);
      }
    },
    resumeTimer() {
      if (this.currentMode != "DONE") {
        this.timerInterval = setInterval(() => (this.timePassed += 1), 1000);
      }
    },
    stopTimer() {
      clearInterval(this.timerInterval);
      if (this.sound != null) {
        this.sound.release();
      }
    }
  }
});
</script>

<style scoped lang="css">

.base-timer__svg {
	transform: scaleX(-1);
}

.base-timer__circle {
	fill: none;
	stroke: none;
}

.base-timer__path-elapsed {
	stroke-width: 7px;
	stroke: #92949c5c;
}

.base-timer__path-remaining {
	stroke-width: 7px;
	stroke-linecap: round;
	transform: rotate(90deg);
	transform-origin: center;
	transition: 1s linear all;
	fill-rule: nonzero;
	stroke: currentColor;
}

.base-timer__path-remaining.green {
	color: #2dd36f;
}

.base-timer__path-remaining.orange {
	color: #ffc409;
}

.base-timer__path-remaining.red {
	color: #eb445a;
}

.base-timer__label {
	position: absolute;
  width: 95%;
  height: 95%;
	top: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 48px;
}

.base-timer__setslabel {
	position: absolute;
  width: 95%;
  height: 120%;
	top: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24px;
}

.base-timer__modelabel {
	position: absolute;
  width: 95%;
  height: 70%;
	top: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24px;
}
</style>
