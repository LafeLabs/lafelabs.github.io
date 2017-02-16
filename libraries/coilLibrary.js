function loadAWG(){
	// This is based entirely on the Wikipedia entry at
	// https://en.wikipedia.org/wiki/American_wire_gauge
	// which is under CC license. 
	// Any added code here is public domain with no restrictions and 
	// no acknowledgement of the legitimacy of the "rule of law" or
	// intellectual "property" in any way
	

	//  IACS Copper Resistivity 20 C:
	//  1.7241x10-8 ohm-meter

	rho = 1.72e-8; //ohm-meter
		
	AWG = [];
	diameter_in = [];
	diameter_mm = [];
	diameter_mils = [];
	diameter_microns = [];
	area_mmxmm = [];
	area_mXm = [];
	RperLength_meters = [];
	RperLength_feet = [];
	RperLength_cm = [];
	
	for(var index = 0;index < 40;index++){
		AWG.push(index + 1);
		diameter_in.push(Math.exp(-1.12436 - 0.11594*(index+1)));
		diameter_mm.push(Math.exp(2.1104 - 0.11594*(index+1)));
		diameter_mils.push(Math.exp(-1.12436 - 0.11594*(index+1))*1000);
		diameter_microns.push(Math.exp(2.1104 - 0.11594*(index+1))*1000);
		area_mmxmm.push(0.25*Math.PI*diameter_mm[index]*diameter_mm[index]);
		area_mXm.push(0.25*Math.PI*diameter_mm[index]*diameter_mm[index]/1e6);
		RperLength_meters.push(rho/area_mXm[index]);
		RperLength_cm.push(RperLength_meters[index]/100)
		RperLength_feet.push(RperLength_cm[index]*2.54*12);
	    
	    	
	}

}