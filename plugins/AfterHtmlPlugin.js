const PluginName = 'AfterHtmlPlugin';

function AfterHtmlPlugin(options){

}

AfterHtmlPlugin.prototype.apply = function(compiler){
  compiler.hooks.compilation.tap(PluginName, compilation => {
    compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tap(PluginName,data => {
      console.log(data)
    }) 
  })
} 


module.exports = AfterHtmlPlugin
