import $ from 'dom7';
import Utils from '../../utils/utils';
import Searchbar from './searchbar-class';

export default {
  name: 'searchbar',
  create() {
    const app = this;
    const searchbar = {
      create(params) {
        return new Searchbar(app, params);
      },
      get(searchbarEl) {
        const $searchbarEl = $(searchbarEl);
        if ($searchbarEl.length && $searchbarEl[0].f7Searchbar) {
          return $searchbarEl[0].f7Searchbar;
        }
        return undefined;
      },
    };
    ('clear enable disable toggle search destroy').split(' ').forEach((searchbarMethod) => {
      searchbar[searchbarMethod] = (searchbarEl = '.searchbar', ...args) => {
        const sb = app.searchbar.get(searchbarEl);
        if (sb) return sb[searchbarMethod](...args);
        return undefined;
      };
    });
    Utils.extend(app, {
      searchbar,
    });
  },
  static: {
    Searchbar,
  },
  on: {
    tabMounted(tabEl) {
      const app = this;
      $(tabEl).find('.searchbar-init').each((index, searchbarEl) => {
        const $searchbarEl = $(searchbarEl);
        app.searchbar.create(Utils.extend($searchbarEl.dataset(), { el: searchbarEl }));
      });
    },
    tabBeforeRemove(tabEl) {
      $(tabEl).find('.searchbar-init').each((index, searchbarEl) => {
        if (searchbarEl.f7Searchbar && searchbarEl.f7Searchbar.destroy) {
          searchbarEl.f7Searchbar.destroy();
        }
      });
    },
    pageInit(page) {
      const app = this;
      page.$el.find('.searchbar-init').each((index, searchbarEl) => {
        const $searchbarEl = $(searchbarEl);
        app.searchbar.create(Utils.extend($searchbarEl.dataset(), { el: searchbarEl }));
      });
      if (app.theme === 'ios' && page.view && page.view.router.separateNavbar && page.$navbarEl && page.$navbarEl.length > 0) {
        page.$navbarEl.find('.searchbar-init').each((index, searchbarEl) => {
          const $searchbarEl = $(searchbarEl);
          app.searchbar.create(Utils.extend($searchbarEl.dataset(), { el: searchbarEl }));
        });
      }
    },
    pageBeforeRemove(page) {
      const app = this;
      page.$el.find('.searchbar-init').each((index, searchbarEl) => {
        if (searchbarEl.f7Searchbar && searchbarEl.f7Searchbar.destroy) {
          searchbarEl.f7Searchbar.destroy();
        }
      });
      if (app.theme === 'ios' && page.view && page.view.router.separateNavbar && page.$navbarEl && page.$navbarEl.length > 0) {
        page.$navbarEl.find('.searchbar-init').each((index, searchbarEl) => {
          if (searchbarEl.f7Searchbar && searchbarEl.f7Searchbar.destroy) {
            searchbarEl.f7Searchbar.destroy();
          }
        });
      }
    },
  },
  clicks: {
    '.searchbar-clear': function clear($clickedEl, data = {}) {
      const app = this;
      const sb = app.searchbar.get(data.searchbar);
      if (sb) sb.clear();
    },
    '.searchbar-enable': function enable($clickedEl, data = {}) {
      const app = this;
      const sb = app.searchbar.get(data.searchbar);
      if (sb) sb.enable(true);
    },
    '.searchbar-disable': function disable($clickedEl, data = {}) {
      const app = this;
      const sb = app.searchbar.get(data.searchbar);
      if (sb) sb.disable();
    },
    '.searchbar-toggle': function toggle($clickedEl, data = {}) {
      const app = this;
      const sb = app.searchbar.get(data.searchbar);
      if (sb) sb.toggle();
    },
  },
};
