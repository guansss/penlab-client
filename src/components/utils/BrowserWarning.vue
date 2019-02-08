<template>
    <div id="browser-warning" class="modal fade" role="dialog">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <span v-if="IE">浏览器不兼容</span>
                    </h5>
                    <button type="button" class="close" data-dismiss="modal">
                        <span>&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <span v-if="IE">
                        请勿使用IE浏览器访问，否则可能会出现不可名状的显示效果 :(
                        <br/>
                        虽然有些地方会做适配，但无法保证不出问题……
                    </span>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-light" data-dismiss="modal">关闭</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="stylus">

</style>

<script>
import $ from 'jquery';

export default {
    name: 'BrowserWarning',
    data: () => ({
        IE: navigator.userAgent.match(/(MSIE|Trident)/)
    }),
    mounted() {
        if (this.IE && !sessionStorage.getItem('IEWarned')) {
            sessionStorage.setItem('IEWarned', '1');
            $('#browser-warning').modal();
        }
    }
};
</script>
