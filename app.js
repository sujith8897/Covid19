const express=require('express');
const bodyParser=require('body-parser');
const ejs=require('ejs')
const request=require('request');

const app=express();

app.set('view engine','ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


function dynamicsort(property,order) {
    var sort_order = 1;
    if(order === "desc"){
        sort_order = -1;
    }
    return function (a, b){
        // a should come before b in the sorted order
        if(a[property] < b[property]){
                return -1 * sort_order;
        // a should come after b in the sorted order
        }else if(a[property] > b[property]){
                return 1 * sort_order;
        // a and b are the same
        }else{
                return 0 * sort_order;
        }
    }
}

var l=[];
app.get("/",function(req,res){

	request("https://api.covid19api.com/summary",function(err,response,body){
		if(!err){
			const data=JSON.parse(body);
			//console.log(data);
			var ans=data.Countries;
			//console.log(ans,typeof ans);
			ans=ans.sort(dynamicsort("TotalConfirmed","desc"));
			var a=0,b=0,c=0,d=0,e=0,f=0,g=0;
			ans.forEach(function(item){
				if(item.Country==="United States of America"){
					l.push("US");
				} else{
					l.push(item.Country);
				}
				if(item.TotalConfirmed>0){
					a+=1
					b+=item.TotalConfirmed;
					c+=item.NewConfirmed;
					d+=item.TotalDeaths;
					e+=item.NewDeaths;
					f+=item.TotalRecovered;
					g+=item.NewRecovered;
				}
			});


			//console.log(l);
			res.render('home',{items:ans,l:l,TotalCountries:a,TotalConfirmed:b,TotalNewConfirmed:c,TotalDeaths:d,TotalNewDeaths:e,TotalRecovered:f,TotalNewRecovered:g});

			//res.send();
		}else{
			res.send("Error");
		}
	});

});


app.get("/countries/:country",function(req,res){
	const str=req.params.country;
	var coun="";
	for(var i=0;i<str.length;i++){
		if (str[i]===' '){
			coun+='-';
		} else{
			coun+=str[i];
		}
	}
	request("https://api.covid19api.com/total/country/"+coun+"/status/confirmed",function(err,response,body){
		const data=JSON.parse(body);
		//console.log(data);
		if(!err){
			res.render('country',{country:str,items:data});
		} else{
			res.send("ERROR");
		}
	});
});


app.get("/precautions",function(req,res){
	res.render('precautions');
});

app.get("/about",function(req,res){
	res.render('about');
});

app.get("/faq",function(req,res){
	res.render('faq');
});


app.listen(process.env.PORT || 3000,function(req,res){
	console.log('Server started on port 3000');
});