$(function(){
  document.querySelector('.btn-save').onclick = function(event){
    event.preventDefault();
    var formData = new FormData();
    formData.append('Book[bookId]',$("#book-bookid").val());
    formData.append('Book[bookName]',$("#book-bookname").val());
    formData.append('Book[bookWriter]',$("#book-bookwriter").val());
    formData.append('Book[bookPublish]',$("#book-bookpublish").val());
    formData.append('Book[bookPrice]',$("#book-bookprice").val());
    $.ajax({
      url: 'http://localhost:3000/yii-basic/web/index.php?r=library2/add',
      type: 'POST',
      data:formData,
      processData: false,  // 不处理数据
      contentType: false,   // 不设置内容类型
      success: function(res){
        console.log(res)
      },
      error: function(err){
        console.error(err)
      }
    })
  }
})
