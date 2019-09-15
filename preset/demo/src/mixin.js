import ReactVueLike from 'react-vue-like';

module.exports = function () {
  return class MixinTest extends ReactVueLike.Mixin {

    static data() {
      return {
        namespace: '',
        loaded: false,
      };
    }

    static computed = {
      account() {
        return this.$store.state.account;
      },
      customer() {
        return this.$store.state.customer;
      },
    }

    async mounted() {
      let module = this.props.module;
      if (!module) throw Error('加载外部模块失败：props.module参数不能为空!');
      this.$external.current = module;
      const params = {
        customer: this.customer,
        account: this.account,
        ...(this.$attrs.initOptions || {})
      };
      console.log('init params', params);
      await module.init(params);
      if (module.namespace) this.namespace = module.namespace;
      this.loaded = true;
      module.render(this.$el, this.renderProps || {});
    }

    beforeDestory() {
      if (this.$external.current === this.module) {
        this.$external.current = null;
      }
    }

    static methods = {
      testFn() {

      }
    }

  };
};
