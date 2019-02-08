<script>
import VPagination from 'vuetify/lib/components/VPagination';
import VBtn from 'vuetify/lib/components/VBtn';
import VIcon from 'vuetify/lib/components/VIcon';

const btnWidth = 36;
const navBtnWidth = btnWidth * 0.8;

export default VPagination.extend({
    name: 'PPagination',
    methods: {
        /**
         * @override calculates `maxButtons` with custom width
         */
        onResize() {
            var width = this.$el && this.$el.parentElement ? this.$el.parentElement.clientWidth : window.innerWidth;
            this.maxButtons = Math.floor((width - (2 * (navBtnWidth + 16/* margin x */))) /
                (btnWidth + 8/* margin x */));
        },

        /**
         * @override generates VBtn with router link and without click handler
         */
        genIcon(h, icon, disabled, fn) {
            return h('li', [h(VBtn, {
                functional: true,
                class: 'pa-0',
                style: {
                    width: navBtnWidth + 'px',
                    height: navBtnWidth + 'px',
                    minWidth: 0
                },
                props: {
                    disabled,
                    activeClass: null,
                    exactActiveClass: null,
                    color: '',
                    to: {
                        path: this.$route.path,
                        query: {
                            ...this.$route.query,
                            page: this.value + (fn === this.next ? 1 : -1)
                        }
                    }
                }
            }, [h(VIcon, [icon])])]);
        },

        /**
         * @override generates VBtn with router link and without click handler
         */
        genItem(h, i) {
            return h(VBtn, {
                functional: true,
                class: 'mx-1',
                style: {
                    width: btnWidth + 'px',
                    minWidth: 0
                },
                props: {
                    activeClass: null,
                    exactActiveClass: null,
                    color: i === this.value ? 'primary' : '',
                    to: {
                        path: this.$route.path,
                        query: {
                            ...this.$route.query,
                            page: i
                        }
                    }
                }
            }, [i]);
        }
    }
});
</script>

<style scoped lang="stylus">
.theme--light .v-btn:not(.v-btn--icon):not(.v-btn--flat)
    background-color white
</style>