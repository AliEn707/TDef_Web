function addWeelHendler(elem,onWheel){
	if (elem.addEventListener) {
		if ('onwheel' in document) {
			// IE9+, FF17+
			elem.addEventListener ("wheel", onWheel, false);
		} else 
			if ('onmousewheel' in document) {
				// устаревший вариант события
				elem.addEventListener ("mousewheel", onWheel, false);
			} else {
				// 3.5 <= Firefox < 17, более старое событие DOMMouseScroll пропустим
				elem.addEventListener ("MozMousePixelScroll", onWheel, false);
			}
	}else { // IE<9
		elem.attachEvent ("onmousewheel", onWheel);
	}
}