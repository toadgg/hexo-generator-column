'use strict';

var pagination = require('hexo-pagination');

var fmtNum = function(num) {
  return num < 10 ? '0' + num : num;
};

module.exports = function(locals) {
  var config = this.config;
  var result = [];
  var Query = this.model('Post').Query;

  config.columns.forEach(function(column){
    var columnDir = config[column + '_dir'] || column;
    var paginationDir = config['pagination_'+ column +'_dir'] || 'page';
    var columnItems = locals.posts.find({column: column}).sort('-date');
    var perPage = config.column_generator.per_page;


    if (!columnItems.length) return;

    if (columnDir[columnDir.length - 1] !== '/') columnDir += '/';

    function generate(path, posts, options) {
      options = options || {};
      options[column] = true;

      result = result.concat(pagination(path, posts, {
        perPage: perPage,
        layout: [column, 'index'],
        format: paginationDir + '/%d/',
        data: options
      }));
    }

    generate(columnDir, columnItems);

    if (!config.column_generator.yearly) return result;

    var posts = {};

    // Organize posts by date
    columnItems.forEach(function(post) {
      var date = post.date;
      var year = date.year();
      var month = date.month() + 1; // month is started from 0

      if (!posts.hasOwnProperty(year)) {
        // 13 arrays. The first array is for posts in this year
        // and the other arrays is for posts in this month
        posts[year] = [
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          []
        ];
      }

      posts[year][0].push(post);
      posts[year][month].push(post);
      // Daily
      if (config.column_generator.daily) {
        var day = date.date();
        if (!posts[year][month].hasOwnProperty(day)) {
          posts[year][month].day = {};
        }

        (posts[year][month].day[day] || (posts[year][month].day[day] = [])).push(post);
      }
    });


    var years = Object.keys(posts);
    var year, data, month, monthData, url;

    // Yearly
    for (var i = 0, len = years.length; i < len; i++) {
      year = +years[i];
      data = posts[year];
      url = columnDir + year + '/';
      if (!data[0].length) continue;

      generate(url, new Query(data[0]), {year: year});

      if (!config.column_generator.monthly && !config.column_generator.daily) continue;

      // Monthly
      for (month = 1; month <= 12; month++) {
        monthData = data[month];
        if (!monthData.length) continue;
        if (config.column_generator.monthly) {
          generate(url + fmtNum(month) + '/', new Query(monthData), {
            year: year,
            month: month
          });
        }

        if (!config.column_generator.daily) continue;

        // Daily
        for (var day = 1; day <= 31; day++) {
          var dayData = monthData.day[day];
          if (!dayData || !dayData.length) continue;
          generate(url + fmtNum(month) + '/' + fmtNum(day) + '/', new Query(dayData), {
            year: year,
            month: month,
            day: day
          });
        }
      }
    }
  });
  return result;
};
