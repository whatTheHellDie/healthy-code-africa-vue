'use strict';

exports.__esModule = true;
exports.default = {
  el: {
    colorpicker: {
      confirm: 'OK',
      clear: 'Clear'
    },
    datepicker: {
      now: 'Now',
      today: 'Today',
      cancel: 'Cancel',
      clear: 'Clear',
      confirm: 'OK',
      selectDate: 'Select date',
      selectTime: 'Select time',
      startDate: 'Start Date',
      startTime: 'Start Time',
      endDate: 'End Date',
      endTime: 'End Time',
      prevYear: 'Previous Year',
      nextYear: 'Next Year',
      prevMonth: 'Previous Month',
      nextMonth: 'Next Month',
      year: '',
      month1: 'January',
      month2: 'February',
      month3: 'March',
      month4: 'April',
      month5: 'May',
      month6: 'June',
      month7: 'July',
      month8: 'August',
      month9: 'September',
      month10: 'October',
      month11: 'November',
      month12: 'December',
      // week: 'week',
      weeks: {
        sun: 'Sun',
        mon: 'Mon',
        tue: 'Tue',
        wed: 'Wed',
        thu: 'Thu',
        fri: 'Fri',
        sat: 'Sat'
      },
      months: {
        jan: 'Jan',
        feb: 'Feb',
        mar: 'Mar',
        apr: 'Apr',
        may: 'May',
        jun: 'Jun',
        jul: 'Jul',
        aug: 'Aug',
        sep: 'Sep',
        oct: 'Oct',
        nov: 'Nov',
        dec: 'Dec'
      }
    },
    select: {
      loading: 'Loading',
      noMatch: 'No matching data',
      noData: 'No data',
      placeholder: 'Select'
    },
    cascader: {
      noMatch: 'No matching data',
      loading: 'Loading',
      placeholder: 'Select'
    },
    pagination: {
      goto: 'Go to',
      pagesize: '/page',
      total: 'Total {total}',
      pageClassifier: ''
    },
    messagebox: {
      title: 'Message',
      confirm: 'OK',
      cancel: 'Cancel',
      error: 'Illegal input'
    },
    upload: {
      deleteTip: 'press delete to remove',
      delete: 'Delete',
      preview: 'Preview',
      continue: 'Continue'
    },
    table: {
      emptyText: 'No Data',
      confirmFilter: 'Confirm',
      resetFilter: 'Reset',
      clearFilter: 'All',
      sumText: 'Sum'
    },
    tree: {
      emptyText: 'No Data'
    },
    transfer: {
      noMatch: 'No matching data',
      noData: 'No data',
      titles: ['List 1', 'List 2'], // to be translated
      filterPlaceholder: 'Enter keyword', // to be translated
      noCheckedFormat: '{total} items', // to be translated
      hasCheckedFormat: '{checked}/{total} checked' // to be translated
    }
  },
  //以上为饿了么控件翻译，以下为自定义翻译
  messages: {
    template1: "Are you sure to operate {1} to {0}?",
    template2: "{0}Year{1}Month",
    template3: "{0}不能为空"
  },
  "加载中": "Loading",
  "关闭当前标签页": "Close the current page",
  "关闭其它标签页": "Close other pages",
  "关闭全部标签页": "Close all pages",
  "刷新当前标签页": "Refresh current page",
  "修改密码": "Change Password",
  "账号": "Account",
  "原密码": "Original Password",
  "新密码": "New Password",
  "确认密码": "Confirm Password",
  "取消": "Cancel",
  "确定": "Sure",
  "确认密码与新密码不一致": "The two passwords are not identical",
  "原密码不能为空": "Please enter the original password",
  "新密码不能为空": "Please enter the new password",
  "确认密码不能为空": "You must enter password",
  "操作成功": "Success",
  "未能找到可用标签页!": "Can’t find available pages",
  "系统管理": "System Management",
  "管理员列表": "Administrators’ List",
  "角色管理": "Roles’Management ",
  "菜单管理": "Menu Management",
  "系统日志": "System Diary",
  "业务管理": "Work Management",
  "项目管理": "Projects Management",
  "查询": "Inquiry",
  "新增": "Add",
  "批量删除": "Delete Group",
  "用户名": "User",
  "序号": "Number",
  "邮箱": "E-mail",
  "手机号": "Phone Number",
  "状态": "Status",
  "创建时间": "Create Time",
  "操作": "Operate",
  "正常": "Normal",
  "修改": "Modify",
  "删除": "Delete",
  "禁用": "Denied",
  "角色名称": "Role’s Name",
  "备注": "Note",
  "暂无数据": "No data",
  "登录账号": "Login Account",
  "密码": "Password",
  "角色": "Role",
  "用户名不能为空": "Please enter user’s name",
  "系统管理员": "System Administrator",
  "管理员": "Administrator",
  "普通用户": "Ordinary User",
  "项目方": "Contractor",
  "角色名称不能为空": "Please enter role",
  "授权": "Authorization",
  "查看": "Check",
  "名称": "Description",
  "上级菜单": "Upper Menu",
  "图标": "Logo",
  "类型": "Type",
  "排序": "Order",
  "菜单URL": "Menu URL",
  "授权标识": "Authorization Logo",
  "目录": "Contents",
  "菜单": "Menu",
  "按钮": "Button",
  "菜单名称不能为空": "Please enter menu",
  "上级菜单不能为空": "Please enter upper menu",
  "点击选择上级菜单": "Select upper menu",
  "菜单路由": "Menu Router",
  "多个用逗号分隔, 如: user:list,user:create": "Use commas to seperate,such as: user:list,user:create",
  "菜单图标": "Menu Logo",
  "菜单图标名称": "Menu Logo’s Name",
  "提示": "Reminder",
  "用户名/用户操作": "User’s Name/User’s Operation",
  "用户操作": "User’s Operation",
  "请求方法": "Method Request",
  "请求参数": "Parameter Request",
  "执行时长(毫秒)": "Processing time(millisecond)",
  "IP地址": "IP address",
  "不能为空": "Can not be empty",
  "商品管理平台": "Healthy-qr management platform",
  "管理员登录": "Admin login",
  "验证码": "Verification code",
  "登录": "log in",
  "后台": "后台",
  "退出": "退出",
  "确定要切换语言吗，切换后您未保存的操作将会被清除":"Are you sure you want to switch languages, your unsaved operations will be cleared after switching",
  //自定义开始
};