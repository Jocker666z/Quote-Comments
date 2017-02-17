/*
	Quote Comments JS
*/

function quote(postid, author, commentarea, commentID, mce) {
    "use strict";
	try {
		var posttext = '';

		if (window.getSelection) {
			posttext = window.getSelection();
		}
        else if (document.getSelection) {
			posttext = document.getSelection();
		}
		else if (document.selection) {
			posttext = document.selection.createRange().text;
		}

            else {
                return true;
            }

		if (posttext == '') {		// quoting entire comment

            // quoteing the entire thing
			var selection = false;
			var commentID = commentID.split("div-comment-")[1];
			// quote entire comment as html
			var theQuote = "q-"+commentID;
			//var theQuote = "div-comment-"+commentID;
			var posttext = document.getElementById(theQuote).innerHTML;
            
			// remove <div>
			var posttext = posttext.replace(/<div(.*?)>((.|\n)*?)(<\/div>)/ig, "");           
            // remove <p>
            var posttext = posttext.replace(/<\/p>/gm, "").replace(/<p>/gm, "");      
            // remove <blockquotes>
            while (posttext != (posttext = posttext.replace(/<blockquote>[^>]*<\/\s*blockquote>/g, "")));
			var posttext = posttext.replace(/<blockquote(.*?)>((.|\n)*?)(<\/blockquote>)/gm, "\n");   
            // remove <span>
			var posttext = posttext.replace(/<span(.*?)>((.|\n)*?)(<\/span>)/ig, "");
  			// various cleanups
			var posttext = posttext.replace(/	/g, "");
			var posttext = posttext.replace(/<br>/g, "")
			var posttext = posttext.replace(/&nbsp;/g, "");    
            var posttext = posttext.replace(/\s\s/gm, "");
		}

		// build quote
		if (author) {
			var quote='<blockquote cite="comment-'+postid+'">\n<strong><a href="#comment-'+postid+'">'+unescape(author)+'</a></strong>:\n '+posttext+' \n</blockquote>\n';
		} else {
			var quote='<blockquote cite="comment-'+postid+'">\n\n'+posttext+'</blockquote>\n';
		}

		// send quoted content
		if (mce == true) {		// TinyMCE detected
			insertHTML(quote);
			insertHTML("<p>&nbsp;</p>");
		} else {				// No TinyMCE detected
			var comment=document.getElementById(commentarea);
			addQuote(comment,quote);
		}
		return false;

	} catch (e) {

		alert("Quote Comments plugin is having some trouble! It could possibly be a problem with your Wordpress theme. Does it work if you use the default theme? Does it work if you disable all other plugins? If you look in the HTML source of a page with comments, can you find <div id='q-[id]'> where [id] is the ID of the comment?")

	}

	

}

function inlinereply(postid, author, commentarea, commentID, mce) {
	try {

		// build quote
		var quote='<strong><a href="#comment-'+postid+'">'+unescape(author)+'</a></strong>, \n';

		// send quoted content
		if (mce == true) {		// TinyMCE detected

			//addQuoteMCE(comment,quote);
			insertHTML(quote);
			insertHTML("<p>&nbsp;</p>");

		} else {				// No TinyMCE detected

			var comment=document.getElementById(commentarea);
			addQuote(comment,quote);

		}

		return false;

	} catch (e) {

		alert("Quote Comments plugin is having some trouble! It could possibly be a problem with your Wordpress theme. Does it work if you use the default theme? Does it work if you disable all other plugins? If you look in the HTML source of a page with comments, can you find <div id='q-[id]'> where [id] is the ID of the comment?")

	}

	

}


function addQuote(comment,quote){

	/*
		Derived from Alex King's JS Quicktags code (http://www.alexking.org/)
		Released under LGPL license
	*/	

	// IE support
	if (document.selection) {
		comment.focus();
		sel = document.selection.createRange();
		sel.text = quote;
		comment.focus();
	}

	// Mozilla support

	else if (comment.selectionStart || comment.selectionStart == '0') {
		var startPos = comment.selectionStart;
		var endPos = comment.selectionEnd;
		var cursorPos = endPos;
		var scrollTop = comment.scrollTop;
		if (startPos != endPos) {

			comment.value = comment.value.substring(0, startPos)
						  + quote
						  + comment.value.substring(endPos, comment.value.length);
			cursorPos = startPos + quote.length

		}

		else {
			comment.value = comment.value.substring(0, startPos) 
							  + quote
							  + comment.value.substring(endPos, comment.value.length);
			cursorPos = startPos + quote.length;

		}

		comment.focus();
		comment.selectionStart = cursorPos;
		comment.selectionEnd = cursorPos;
		comment.scrollTop = scrollTop;

	}

	else {

		comment.value += quote;

	}

	// If Live Preview Plugin is installed, refresh preview
	try {
		ReloadTextDiv();
	}
	catch ( e ) {
	}

}
