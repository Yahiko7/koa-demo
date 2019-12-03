const PluginName = 'AfterHtmlPlugin';

function AfterHtmlPlugin(options){}

AfterHtmlPlugin.prototype.apply = function(compiler){
  compiler.hooks.compilation.tap(PluginName, compilation => {
    compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tap(PluginName,data => {
      const fileName = /([a-zA-Z]+-[a-zA-Z]+)\.pug/.exec(data.plugin.options.filename)[1];
         
      data.assets.js = data.assets.js.filter(item => {
        return item.includes(fileName)
      })
      
      data.assets.css = data.assets.css.filter( item => {
        return item.includes(fileName)
      })

      data.html = data.html.replace('//- injectjs',`script(src="${data.assets.js[0]}")`)
      data.html = data.html.replace('//- injectcss',`link(rel='stylesheet', href='${data.assets.css[0]}')`)
      
    }) 
  })
} 


module.exports = AfterHtmlPlugin
