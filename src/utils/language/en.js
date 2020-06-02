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
  "Heathy-qr管理平台": "Healthy-qr management platform",
  "管理员登录": "Admin login",
  "验证码": "Verification code",
  "登录": "log in",
  "后台": "后台",
  "退出": "退出",
  "确定要切换语言吗，切换后您未保存的操作将会被清除": "Are you sure you want to switch languages, your unsaved operations will be cleared after switching",
  //自定义开始
  "上级部门": "Higher office",
  "冻结": "freeze",
  "解冻": "thaw",
  "全部": "All",
  "健康": "health",
  "疑似": "Suspect",
  "确诊": "Confirmed diagnosis",
  "治愈": "cure",
  "注册时间": "Registration time",
  "未冻结": "Not frozen",
  "已冻结": "Frozen",
  "健康状态": "health status",
  "请选择": "please choose",
  "姓名": "Name",
  "手机号码": "cellphone number",
  "证件号码": "ID number",
  "性别": "gender",
  "国籍": "Country of Citizenship",
  "死亡": "death",
  "健康状态调整": "Health adjustment",
  "女": "Female",
  "男": "male",
  "证件类型": "type of certificate",
  "家庭住址": "Home address",
  "公司名称": "company name",
  "照片": "photo",
  "健康问卷": "Health questionnaire",
  "通过": "by",
  "未通过": "Did not pass",
  "待审核": "Pending review",
  "身份证号码": "identification number",
  "出入地址": "Access address",
  "审核状态": "Approval Status",
  "申请人": "applicant",
  "申请人电话": "Applicant phone",
  "负责人姓名": "name of person in charge",
  "负责人号码": "Person in charge",
  "负责人证件号码": "Person in charge of the document",
  "详细地址": "Address",
  "申请时间": "application time",
  "审核时间": "Review time",
  "标题": "title",
  "内容": "content",
  "添加": "Add to",
  "发送时间": "Send time",
  "来源": "source",
  "添加地区": "Add region",
  "添加建筑地址": "Add building address",
  "省份": "province",
  "城市": "city",
  "地区": "area",
  "建筑地址": "Building address",
  "编号": "Numbering",
  "确定要更改状态吗?": "Are you sure you want to change the status?",
  "部门管理": "Department management",
  "首页": "Home",
  "部门权限": "Department authority",
  "全部数据权限": "Full data permissions",
  "自定数据权限": "Custom data permissions",
  "本部门数据权限": "Data authority in this department",
  "本部门及以下数据权限": "Data authority for this department and below",
  "仅本人数据权限": "Only my data permissions",
  "数据范围": "data range",
  "部门": "department",
  "展开/收缩": "Expand / collapse",
  "归属部门": "Attribution Department",
  "门店管理": "Store Management",
  "门店名称": "Store name",
  "门店区域": "Store area",
  "联系人": "Contact person",
  "手机": "Mobile phone",
  "基础信息": "basic information",
  "地址列表": "Address list",
  "出入列表": "Access list",
  "用户信息": "User Info",
  "资讯发布": "Information release",
  "消息管理": "Message management",
  "物资管理": "Material management",
  "物资门店管理": "Material store management",
  "物资申领记录": "Material claim record",
  "商城管理": "Mall Management",
  "店铺列表": "Shop list",
  "订单列表": "Order List",
  "优惠券列表": "Coupon list",
  "审批管理": "Approval management",
  "公共场所审批": "Approval in public places",
  "欢迎登录Heathy-qr后台管理！": "Welcome to Heathy-qr background management",
  "添加地址": "Add address",
  "地址": "address",
  "独立地址": "Independent address",
  "下级地址": "Subordinate address",
  "登陆账号": "Login account",
  "密码初始化": "Password initialization",
  "机构名称": "institution name",
  "申领人": "Claimant",
  "联系电话": "contact number",
  "物资名称": "Material name",
  "数量": "Quantity",
  "美食": "Food",
  "果蔬": "Fruits and vegetables",
  "超市": "Supermarket",
  "医药": "medicine",
  "店铺名称": "shop name",
  "店铺类型": "Shop type",
  "电话": "phone",
  "店铺区域": "Shop area",
  "门店地址": "Store Address",
  "管理员账号": "Admin account",
  "总价": "Total price",
  "用户姓名": "username",
  "用户电话": "User phone",
  "下单时间": "order time",
  "未使用": "Unused",
  "已使用": "Used",
  "领取人": "Recipients",
  "领取人电话": "Recipient Phone",
  "优惠券状态": "Coupon status",
  "优惠券金额": "Coupon amount",
  "优惠券名称": "Coupon name",
  "有效期": "Expiration date",
  "审批通过": "Approved",
  "审批不通过": "Approval failed",
  "店铺地址": "shop address",
  "logo": "logo",
  "是否去过疫区？": "Do you have the following symptoms",
  "是的": "Yes",
  "否定": "No",
  "是否常驻本地？": "If he resides locally?？",
  "是的，已经在本地居住3月以上": "Yes, I have lived locally for more than 3 months",
  "外地返回不过14日": "No return from the field for 14 days",
  "近期接触史": " Recent history of close contacts ",
  "14日内密切接触近期有境外疫区者": "Close contact with those who were recently affected by the epidemic within 14 days",
  "14日内没有密切接触近期有境外疫区者": "Those who have not been in close contact with the recent overseas epidemic zone within 14 days",
  "个人健康状态": "Personal health?",
  "正常活动，自觉正常无不适症状": "Normal activity and awareness without discomfort",
  '居家健康服务，本地有固定住处，在家自我健康观察': 'Home health service, local fixed residence, self-observation of home health',
  '集中健康服务，本地无固定住处，在家自我健康观察，如住节点登实施集中观察': 'Centralized health services, where there is no fixed place to live, such as staying in a hotel, etc.',
  "集中医学观察，在医疗机构医学观察": "Centralized medical observation, medical observation in medical institutions",
  "您是否有以下症状？": " Do you have the following symptoms",
  "发烧": "Fever",
  "乏力": "Tiredness",
  "干咳": "Dry cough",
  "无": "No",
};