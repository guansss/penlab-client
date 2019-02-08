<template>
    <div class="spinner spinner--ping-pong">
        <div v-bind:style="innerStyles" class="spinner-inner">
            <div class="board">
                <div class="left">
                </div>
                <div class="right">
                </div>
                <div class="ball">
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="stylus">
@require '../../styles/global.styl'

.spinner {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    * {
        line-height: 0;
        box-sizing: border-box;
    }
}

.board {
    width: 250px;
    position: relative;
}

.left,
.right {
    height: 50px;
    width: 15px;
    background: $color-accent;
    display: inline-block;
    position: absolute;
}

.left {
    left: 0;
    animation: pingpong-position1 2s linear infinite;
}

.right {
    right: 0;
    animation: pingpong-position2 2s linear infinite;
}

.ball {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #41b883;
    position: absolute;
    animation: pingpong-bounce 2s linear infinite;
}

@keyframes pingpong-position1 {
    0% {
        top: -60px;
    }
    25% {
        top: 0;
    }
    50% {
        top: 60px;
    }
    75% {
        top: -60px;
    }
    100% {
        top: -60px;
    }
}

@keyframes pingpong-position2 {
    0% {
        top: 60px;
    }
    25% {
        top: 0;
    }
    50% {
        top: -60px;
    }
    75% {
        top: -60px;
    }
    100% {
        top: 60px;
    }
}

@keyframes pingpong-bounce {
    0% {
        top: -35px;
        left: 10px;
    }
    25% {
        top: 25px;
        left: 225px;
    }
    50% {
        top: 75px;
        left: 10px;
    }
    75% {
        top: -35px;
        left: 225px;
    }
    100% {
        top: -35px;
        left: 10px;
    }
}
</style>

<script>
export default {
    props: {
        size: {
            default: '60px'
        }
    },
    computed: {
        innerStyles() {
            let size = parseInt(this.size);
            return {
                transform: 'scale(' + (size / 250) + ')'
            };
        }
    }
};
</script>
