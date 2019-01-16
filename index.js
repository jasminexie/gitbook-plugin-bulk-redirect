/**
 * Copyright 2016 Kaustav Das Modak
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var url = require("url");
var fs = require("fs");

var content = function(path) {
  var s = "<!DOCTYPE HTML><html><head><meta charset='UTF-8'><title>欢迎您使用AppAdhoc A/B Testing，用[A/B测试](http://www.appadhoc.com)驱动产品优化。</title>" +
        "<link rel='canonical' href='{}'><meta http-equiv=refresh content='0; url={:?}'></head>" +
        "<body><h1>页面已移动，正在跳转...</h1>" +
        "<p><a href='{}'>点击此处跳转到文档</a></p>" +
        "<script>window.location.href='{}';</script>" +
        "</body></html>";
  return s.replace(/\{\}/gm, path).replace(/\{\:\?\}/gm, encodeURI(path));
};


module.exports = {
  hooks: {
    "finish": function() {
      var redirectConf = this.config.get("pluginsConfig.bulk-redirect");
      var conf = JSON.parse(fs.readFileSync(redirectConf.redirectsFile, "utf-8"));

      if (!conf || !conf.redirects) return;
      if (this.isLanguageBook()) return;

      var basepath = redirectConf.basepath || "/";
      var g = this;

      conf.redirects.forEach(function (item) {
        if (!item.from || !item.to) return;
        var resolved = url.resolve(basepath, item.to);
        g.output.writeFile(item.from, content(resolved));
        g.log.debug("Redirect " + item.from + " -> " + resolved + "\n");
      });
    }
  }
};
