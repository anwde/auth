import Basic_Component from "../../components/base/component";
import webapi from "../../utils/webapi";
export default class Basic_Novel extends Basic_Component {
  constructor(props) {
    super(props);
    webapi.store.dispatch({
      type: "SIDEBARACTIVE",
      data: { expand: { 47: true }, selected: 48 },
    });
  }

  /*----------------------1 other start----------------------*/
  async get_group(reset = false) {
    let group = this.group || {};
    if (reset || Object.keys(group).length === 0) {
      group = webapi.cache.get("category_group");
      if (!group) {
        const res = await webapi.request.get("books/category/group");
        if (res.code === 10000) {
          group = res.data;
          webapi.cache.set("category_group", group, 60 * 60 * 1);
        }
      }
      this.group = group;
    }
    return group;
  }
  async get_dutys(reset = false) {
    let dutys = this.dutys || [];
    if (reset || dutys.length === 0) {
      const res = await webapi.request.get("books/home/duty");
      if (res.code === 10000) {
        dutys = res.lists;
      }
      this.dutys = dutys;
    }
    return dutys;
  }

  /**
   * other 获取服务器状态
   */
  async get_server_state(reset = false) {
    var state = this.server_state || {};
    if (reset || Object.keys(state).length === 0) {
      state = webapi.cache.get("books_state");
      if (!state) {
        const res = await webapi.request.get("books/home/state");
        if (res.code === 10000) {
          state = res.data;
          webapi.cache.set("books_state", state, 60 * 60 * 1);
        }
      }
      this.server_state = state;
    }

    return state;
  }
  async get_category_dict(reset = false) {
    var category_dict = this.category_dict || {};
    if (reset || Object.keys(category_dict).length === 0) {
      category_dict = webapi.cache.get("category_dict");
      if (!category_dict) {
        let res = await webapi.request.get("books/category/dict");
        if (res.code === 10000) {
          category_dict = res.data;
          webapi.cache.set("category_dict", category_dict, 60 * 60 * 1);
        }
      }
      this.category_dict = category_dict;
    }
    return category_dict;
  }

  async get_category(reset = false) {
    var category = this.category || [];
    if (reset || category.length === 0) {
      category = webapi.cache.get("books_category");
      if (!category) {
        let res = await webapi.request.get("books/category/lists");
        if (res.code === 10000) {
          category = res.lists;
          webapi.cache.set("books_category", category, 60 * 60 * 1);
        }
      }
      this.category = category;
    }
    return category;
  }
  async get_tag(reset = false) {
    var tag = this.tag || {};
    if (reset || Object.keys(tag).length === 0) {
      tag = webapi.cache.get("books_tag");
      if (Object.keys(tag).length == 0) {
        let res = await webapi.request.get("books/tag/lists");
        if (res.code === 10000) {
          tag = res.data;
          webapi.cache.set("books_tag", tag, 60 * 60 * 1);
        }
      }
      this.tag = tag;
    }
    return tag;
  }
  async get_book(reset = false, book_id) {
    var book_id = book_id ? book_id : this.state.book_id;
    var book = this.book ? (this.book[book_id] ? this.book[book_id] : {}) : {};
    // console.log('handle_init=>',this.book,book)
    if (reset || Object.keys(book).length === 0) {
      var res = await webapi.request.get("novel/books/get", {
        book_id: book_id,
      });
      if (res.code === 10000) {
        book = res.data;
      }
    }
    this.book = {};
    this.book[book_id] = book;
    // console.log('handle_init=>',this.book)
    return this.book[book_id];
  }
  async get_volume(d = {}, reset = false) {
    var volume = this.volume
      ? this.volume[this.state.book_id]
        ? this.volume[this.state.book_id]
        : {}
      : {};
    if (reset || volume.length === 0) {
      var p = d;
      p.book_id = this.state.book_id;
      var res = await webapi.request.get("novel/volume/lists", p);
      if (res.code === 10000) {
        volume = res.lists;
      }
    }
    this.volume = {};
    this.volume[this.state.book_id] = volume;
    return this.volume[this.state.book_id];
  }
  async get_channel(reset = false) {
    var channel = this.channel || {};
    if (reset || Object.keys(channel).length === 0) {
      channel = webapi.cache.get("books_channel");
      if (!channel) {
        let res = await webapi.request.get("novel/books/channel");
        if (res.code === 10000) {
          channel = res.data;
          webapi.cache.set("books_channel", channel, 60 * 60 * 1);
        }
      }
      this.channel = channel;
    }
    return channel;
  }

  async get_author_info(user_id, reset = false) {
    var author = this.authors
      ? this.authors[user_id]
        ? this.authors[user_id]
        : {}
      : {};
    if (reset || Object.keys(author).length === 0) {
      var res = await webapi.request.get("novel/author/info", {
        user_id,
      });
      if (res.code === 10000) {
        author = res.data;
      }
    }
    this.authors = this.authors || {};
    this.authors[user_id] = author;
    return this.authors[user_id];
  }
  /*----------------------1 other end----------------------*/

  /*----------------------2 init start  ----------------------*/

  __handle_init_before = () => {
    if (!this.category || this.category.length === 0) {
      this.get_category();
    }
    if (!this.channel || Object.keys(this.channel).length === 0) {
      this.get_channel();
    }
    this.get_dutys();
    if (
      !this.server_state ||
      Object.keys(this.server_state.chapter).length === 0
    ) {
      this.get_server_state();
    }
  };

  __init_state_before() {
    return {
      checked_ids: {},
      checkbox_all: false,
      book_id: this.props.match.params.book_id || 0,
    };
  }
  /*----------------------2 init end  ----------------------*/

  /*----------------------3 handle start  ----------------------*/
  handle_checkbox_all = () => {
    const checkbox_all = !this.state.checkbox_all;
    const checked_ids = this.state.checked_ids || {};
    this.state.lists.map((item, key) => {
      if (checked_ids[item.id]) {
        delete checked_ids[item.id];
      } else {
        checked_ids[item.id] = item.id;
      }
    });
    this.setState({ checkbox_all, checked_ids });
  };
  handle_checkbox = (id) => {
    let checkbox_all = this.state.checkbox_all;
    const checked_ids = this.state.checked_ids || {};
    if (checked_ids[id]) {
      delete checked_ids[id];
    } else {
      checked_ids[id] = id;
    }
    if (Object.keys(checked_ids).length == this.state.lists.length) {
      checkbox_all = true;
    }
    this.setState({ checkbox_all, checked_ids });
  };
  __handle_init_index=()=>{
    this.setState({pagination:this.__init_page_data()},()=>{this.__init_index()});
  }
  /*----------------------3 handle end  ----------------------*/

  /*----------------------4 render start  ----------------------*/

  /*----------------------4 render end  ----------------------*/
}
