// Konsulterna Grid
// Callback when finished

(function() {

	window.Grid = function(args) {

		var container
		var gridItems = []
		var gridRelativeTo
		var info = document.querySelector('.info')

		// Default state
		var state = {
			status: null,
			responsiveMode: false,
			containerHeight: null,
			gutterHeight: null,
			positionTop: 0,
			itemHeight: null,
			itemWidth: null,
			percentHeight: null,
			relativeHeight: null,
			paddingLeft: null,
		}

		// Override default options
		var options = {
			responsiveWidth: args.responsiveWidth || null,
			gridContainer: args.gridContainer || null,
			columnHeight: args.columnHeight || 25,
			gutterHeight: 2, // only applies to vertical grid
			aspectRatio: { w: 16, h: 9 },
			direction:'vertical',
			responsiveWidth: 700,
			paddingTop: 5,
			gridRelativeTo: args.gridRelativeTo,
			paddingLeft: 2,
			onrender: function() {
				console.log('finished rendering')
			},
		}

		// Check for user errors in options
		if( !options.gridContainer ) {
			throw new Error('No grid container was defined.')
		}

		var animate = function(cb) {
			window.requestAnimationFrame(cb)
		}

		var updateHeights = function() {

			if( gridRelativeTo === window ) {
				state.relativeHeight = window.innerHeight
			} else {
				state.relativeHeight = gridRelativeTo.getBoundingClientRect().height
			}

			// Calculate how many pixels are one percent of the container height
			state.percentHeight = state.relativeHeight / 100

			// Calculate grid padding
			state.positionTop = state.percentHeight * options.paddingTop

			// Caluclate grid container height
			state.containerHeight = state.relativeHeight - (state.positionTop * 2)

			// Calculate gutter height
			state.gutterHeight = state.percentHeight * options.gutterHeight

			// Calculate item height
			var totalItemHeight = state.containerHeight - state.gutterHeight * 3
			state.itemHeight = totalItemHeight / 100 * options.columnHeight

		}

		var updateWidths =  function() {

			state.itemWidth = state.itemHeight / 9 * 16

			state.paddingLeft = gridRelativeTo.innerWidth / 100 * options.paddingLeft

		}

		var resize = function() {

			updateHeights()
			updateWidths()

			animate(function() {
				for( var i = 0; i < gridItems.length; ++i ){
					gridItems[i].element.style.height = state.itemHeight + 'px'
					gridItems[i].element.style.width = state.itemWidth + 'px'

					if( i !== gridItems.length - 1 )
						gridItems[i].element.style.marginBottom = state.gutterHeight + 'px'
				}

				gridContainer.parentElement.style.position = 'relative'
				gridContainer.style.position = 'absolute'
				gridContainer.style.top = state.positionTop + 'px'
				gridContainer.style.height = state.containerHeight + 'px'
				gridContainer.style.left = state.paddingLeft + 'px'
			})

		}

		var destroy = function() {
			gridContainer.removeAttribute('style')

			for( var i = 0; i < gridItems.length; ++i ){
				gridItems[i].element.removeAttribute('style')
			}

			state.status = 'destroyed'
		}

		var getRatio = function(element) {

			var ratio = element.getAttribute('data-aspectratio')
			ratio = ratio.split(':')

			return {
				w: ratio[0],
				h: ratio[1],
			}

		}

		var create = function() {
			state.status = 'creating'

			gridContainer = options.gridContainer
			gridRelativeTo = options.gridRelativeTo

			gridContainer.style.boxSizing = 'border-box'
			gridContainer.style.display = 'block'

			// Prepeare grid items
			for( var i = 0; i < gridContainer.children.length; ++i ){

				var item = gridContainer.children[i]

				item.style.boxSizing = 'border-box'

				gridItems.push({
					element: item,
					aspectRatio: getRatio(item),
				})
			}

			resize()

			state.status = 'rendered'

			// callback
			if (options.onrender) options.onrender()
		}

		return {
			state: state,
			options: options,
			create: create,
			resize: resize,
			destroy: destroy,
		}

	}

})()