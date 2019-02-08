<template>
    <div class="container">
        <form>
            <h2>Title</h2>
            <input class="w-100" title="Title" v-model="postTitle"/>
            <h2>Summary</h2>
            <textarea class="w-100" rows="3" title="Summary" v-model="postSummary"></textarea>
            <h2>Content</h2>
            <textarea class="w-100" rows="30" title="Content" v-model="postContent"></textarea>
        </form>
        <button :class="['btn','btn-primary',{disabled:submitButtonText!=='Submit'}]" @click="submit">
            {{submitButtonText}}
        </button>
        <p>{{infoText}}</p>
        <a :href="link">{{link}}</a>
    </div>
</template>

<style scoped lang="stylus">

</style>

<script>
import {postFetch} from '../utils/common';

export default {
    name: 'Create',
    data: () => ({
        postTitle: '',
        postSummary: '',
        postContent: '',

        submitButtonText: 'Submit',
        infoText: '',
        link: ''
    }),
    methods: {
        async submit() {
            this.submitButtonText = 'Pending';

            try {
                const response = await postFetch('/api/posts/', {
                    title: this.postTitle,
                    summary: this.postSummary,
                    content: this.postContent
                });

                if (response.status === 201) {
                    const json = await response.json();
                    this.infoText = 'Succeeded: ' + JSON.stringify(json);
                    this.link = '#/articles/' + json.id;
                } else {
                    this.infoText = await response.json();
                }
            } catch (e) {
                this.infoText = json;
            } finally {
                this.submitButtonText = 'Submit';
            }
        }
    }
};
</script>
