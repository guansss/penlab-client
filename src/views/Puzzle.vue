<template>
    <div class="main container markdown-body">
        <h3 class="title">&nbsp;&nbsp;解开谜题{{ result && resultKey ? '！' : '？' }}</h3>
        <div class="desc">
            <template v-if="result">
                <p>恭喜！您已经解开了谜题……吗？</p>
                <p>目前还不能确定，因为即使没有解开，您也可以通过某种方式来到达此处</p>
                <p>不过，如果下面的字符能组成完整的一句话，那就代表您已经真正地揭开了谜题，干得不错！</p>
                <p v-if="!resultKey">*没有找到密钥，请在正确地完成谜题之后点击链接跳转至此处</p>
            </template>
            <template v-else>
                <p>您还没有解开谜题！请在正确地完成谜题之后点击链接跳转至此处</p>
            </template>
        </div>
        <div class="result">{{ result }}</div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { useRoute } from 'vue-router';

const KEYS: Record<string, string> = {
    travel: 'Su`vbnnof\'eq)|`d!twdec"hg!kmba|',
};

const query = useRoute().query;
const result = ref('');

const resultKey = (query['key'] as string | undefined) || '';

let tickerHandle: number;

if (query['solved']) {
    result.value = KEYS[query['solved'] as string] || '';

    if (result.value && resultKey) {
        let i = 0;

        tickerHandle = setInterval(() => {
            decode(i++);

            if (i >= result.value.length) {
                clearInterval(tickerHandle);
            }
        }, 80);
    }
}

onBeforeUnmount(() => clearInterval(tickerHandle));

function decode(index: number) {
    const decoded = String.fromCharCode(
        result.value.charCodeAt(index) ^ resultKey.charCodeAt(index % resultKey.length) % 10
    );

    result.value = result.value.slice(0, index) + decoded + result.value.slice(index + 1);
}
</script>

<style scoped>
.main {
    text-align: center;
}

.title {
    /* use !important to override the rule in external github-markdown.css */
    margin-top: 15vh !important;

    margin-bottom: 40px;
    font-size: 5em;
    font-weight: 500;
}

.result {
    margin-top: 36px;
    font-size: 2em;
    font-family: Consolas, Courier, monospace;
}
</style>
