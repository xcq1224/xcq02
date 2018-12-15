import locList from "./locList"

let data = []

function isArray(o){
    return Object.prototype.toString.call(o)=='[object Array]';
}
locList.data.Location.CountryRegion.map((item0, index0) => {
    let country = {}
    country.value = item0['-Name']
    country.label = item0['-Name']
    country.children = []
    if(!item0.State){
        //  只有国家
        let province = {}
        province.value = '-'
        province.label = '-'
        province.children = [{value:'-', label: '-'}]
        country.children.push(province)
    }else if(isArray(item0.State)){
        item0.State.map((item1, index1) => {
            if(!item1.City){
                //  有州，没城市
                let province = {}
                province.value = item1['-Name']
                province.label = item1['-Name']
                province.children = [{value:'-', label: '-'}]
                country.children.push(province)
            }else if(isArray(item1.City)){
                //  有州有城市
                let province = {}
                province.value = item1['-Name']
                province.label = item1['-Name']
                province.children = []
                item1.City.map((item2, index2) => {
                    let city = {}
                    city.value = item2['-Name']
                    city.label = item2['-Name']
                    province.children.push(city)
                })
                country.children.push(province)
            }else{
                //  有州只有一个城市
                let province = {}
                province.value = item1['-Name']
                province.label = item1['-Name']
                province.children = [{value: item1.City['-Name'], label: item1.City['-Name']}]
                country.children.push(province)
            }
        })
    }else{
        //  没有州，有城市
        let province = {}
        province.value = '-'
        province.label = '-'
        province.children = []
        item0.State.City.map((item3, index3) => {
            let city = {}
            city.value = item3['-Name']
            city.label = item3['-Name']
            province.children.push(city)
        })
        country.children.push(province)
    }
    data.push(country)
})
export default {
    data,
}