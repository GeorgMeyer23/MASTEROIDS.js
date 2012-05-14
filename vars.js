var _colors = {

    palette: [
		[
			{ r:  128, g: 131, b: 136 }
			,{ r: 170, g: 174, b: 177 }
			,{ r: 190, g: 194, b: 197 }
			,{ r: 222, g: 222, b: 222 }
			,{ r: 243, g: 243, b: 243 }
			,{ r: 196, g: 218, b: 229 }
			,{ r: 175, g: 208, b: 223 }
			,{ r: 119, g: 196, b: 222 }
			,{ r:  91, g: 177, b: 204 }
			,{ r:   0, g: 167, b: 211 }
			,{ r:   0, g: 156, b: 204 }
		]
		,[
			{ r:  106, g:  47, b: 129 }
			,{ r: 125, g:  67, b: 142 }
			,{ r: 145, g:  64, b: 156 }
			,{ r: 180, g:  69, b: 161 }
			,{ r: 207, g:  73, b: 168 }
			,{ r: 228, g:  77, b: 172 }
			,{ r: 255, g: 209, b: 115 }
			,{ r: 255, g: 195, b: 123 }
			,{ r: 252, g: 178, b: 133 }
			,{ r: 245, g: 144, b: 150 }
			,{ r: 237, g: 103, b: 162 }
		]
		,[
			{ r:    0, g: 138, b: 138 }
			,{ r:   1, g: 166, b: 160 }
			,{ r:   1, g: 177, b: 174 }
			,{ r: 248, g: 227, b:   0 }
			,{ r: 252, g: 192, b:   0 }
			,{ r: 253, g: 168, b:   0 }
			,{ r: 254, g: 133, b:   0 }
			,{ r: 255, g: 100, b:  46 }
			,{ r: 188, g: 182, b:  24 }
			,{ r: 176, g: 171, b:  19 }
			,{ r: 139, g: 134, b:  14 }
		]
		,[
			{ r:  232, g: 230, b: 191 }
			,{ r: 218, g: 211, b: 167 }
			,{ r: 196, g: 182, b: 137 }
			,{ r: 255, g: 191, b:  67 }
			,{ r: 249, g: 136, b:  30 }
			,{ r: 238, g: 112, b:  28 }
			,{ r: 151, g: 111, b: 101 }
			,{ r: 129, g:  85, b:  84 }
			,{ r: 103, g:  62, b:  66 }
			,{ r:  75, g:  39, b:  53 }
			,{ r:  58, g:  25, b:  42 }
		]
		,[
			{  r:  89, g:  79, b:  79 }
			,{ r:  84, g: 121, b: 128 }
			,{ r:  69, g: 173, b: 168 }
			,{ r: 157, g: 224, b: 173 }
			,{ r: 229, g: 252, b: 194 }
		]
		,[
			 { r: 119, g:  79, b:  56 }
			,{ r: 224, g: 142, b: 121 }
			,{ r: 241, g: 212, b: 175 }
			,{ r: 236, g: 229, b: 206 }
			,{ r: 197, g: 224, b: 220 }
		]
		,[
			 { r:  85, g:  66, b:  54 }
			,{ r: 247, g: 120, b:  37 }
			,{ r: 211, g: 206, b:  61 }
			,{ r: 241, g: 239, b: 165 }
			,{ r:  96, g: 185, b: 154 }
		]
	]
};

var _forms = {
    cross: function(ctx, iFormSize) {
		ctx.beginPath();
		ctx.moveTo(-iFormSize/2, -iFormSize);
		ctx.lineTo(-iFormSize/2, -iFormSize/2);
		ctx.lineTo(-iFormSize, -iFormSize/2);
		ctx.lineTo(-iFormSize, iFormSize/2);
		ctx.lineTo(-iFormSize/2, iFormSize/2);
		ctx.lineTo(-iFormSize/2, iFormSize);
		ctx.lineTo(iFormSize/2, iFormSize);
		ctx.lineTo(iFormSize/2, iFormSize/2);
		ctx.lineTo(iFormSize, iFormSize/2);
		ctx.lineTo(iFormSize, -iFormSize/2);
		ctx.lineTo(iFormSize/2, -iFormSize/2);
		ctx.lineTo(iFormSize/2, -iFormSize);
		ctx.closePath();
	}
};
