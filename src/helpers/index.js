const helpers = {
    raw: function(options) {
        return options.fn(this);
    },
    ifEquals: function(arg1, arg2, options) {
      return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    },
    includes: function(array, id) {
        if(array.includes(parseInt(id))) {
            return true;
        } else {
          return false;
        }
    },
    multiply: function (a, b) {
      var count = a * b;
      count = count.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
      return count;
    },
    convertPrice: function (price) {
      if (price) {
        price = price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
        return price;
      }
      return false;
    },
    convertDate: function (dateString) {
      const date = new Date(dateString);

      // Lấy giờ và phút
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');

      // Lấy ngày, tháng và năm
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Tháng bắt đầu từ 0

      const year = date.getFullYear();

      // Tạo chuỗi kết quả
      const result = `${hours}:${minutes} ${day}/${month}/${year}`;

      return result;
    },
    convertPayment: function(payment) {
      if(payment == 1) {
        return "Tiền mặt";
      }
      if(payment == 2) {
        return "Chuyển khoản";
      }
    },

    colorStartusOder: function(status) {
      if (status == "Đã phê duyệt") {
        return "#1cc700";
      }else {
        return "red";
      }
    },

    colorStartusOderDetail: function(status) {
      if (status == "Đã phê duyệt") {
        return "label-success";
      }else {
        return "label-danger";
      }
      // label-info
      // label-primary
    }
  };
module.exports = helpers;