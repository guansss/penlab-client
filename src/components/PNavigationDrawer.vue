<script>
import VNavigationDrawer from 'vuetify/lib/components/VNavigationDrawer';

const superStyles = VNavigationDrawer.computed.styles;

export default {
    name: 'PNavigationDrawer',
    extends: VNavigationDrawer,
    props: {
        mobile: false,
    },
    computed: {
        styles() {
            const styles = superStyles.call(this);
            const transformX = this.calculatedTransform === 0 ?
                0 :
                Math.sign(this.calculatedTransform || 1) * 100 + '%';
            styles.transform = `translateX(${transformX})`;
            return styles;
        },
        isMobile() {
            return !this.stateless &&
                !this.permanent &&
                !this.temporary &&
                this.mobile;
        },
    },
};
</script>
