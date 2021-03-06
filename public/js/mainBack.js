var itemStyle = {};
    itemStyle.normal = {color: "#8dc63f"};
    //itemStyle.normal.label = {textStyle: {color: "#fff"}};
    itemStyle.emphasis = {color: "#8dc63f"};
var itemSelected = {};
var myChart;
var zNodes=[];
//getNodes();
// 路径配置
require.config({
    paths: {
        echarts: 'js'
    }
});
// 使用
require(
    [
        'echarts',
        'echarts/chart/tree'
    ],
    function (ec) {
        // 基于准备好的dom，初始化echarts图表
        myChart = ec.init(document.getElementById('main'));

        var data=getNodes();
        //console.log(data);
        itemSelected = data[0];
        itemSelected.itemStyle = itemStyle;
        setData(myChart,data);
        myChart.on('click', function(param) {
            var temp = JSON.parse(JSON.stringify(zNodes));
            console.log(param);
            for (var i = 0; i < temp.length; i++) {
                if(temp[i].name == param.name) {
                    $("#info").text(temp[i].name);
                    temp[i].itemStyle = itemStyle;
                    break;
                }
            }
            itemSelected = param.data;
            var mytree=new treeMenu(temp)
            var myTreeData = mytree.init("0");
            var data=myTreeData.children;
            //console.log("data:"+JSON.stringify(data));
            setData(myChart,data,0);
        });
    }
);

function getNodes(){
  var newData;
  $.ajax({
    async : false,
    url : 'departmentList.do',
    type : 'GET',
    dataType : 'json',
    timeout : '30000',
    success : function(result) {
      zNodes = result;
      var mytree=new treeMenu(zNodes)
      var myTreeData = mytree.init("0");
    	newData = myTreeData.children;
    },
    error : function(result) {
      swal('网络错误');
    }
  });
  return newData;
}

function setData(myChart,data){
    var arr1=[];
    var arr2=[];
    var secondChild = data[0].children;
    for (var i = 0; i < secondChild.length; i++) {
        if(secondChild[i]['children'].length == 0) {
            arr2.push(secondChild[i]);
        } else {
            arr1.push(secondChild[i]);
        }
    }
    var temp = JSON.parse(JSON.stringify(data[0]));
    temp.children = [];
    var data1 = [JSON.parse(JSON.stringify(temp))];
    var data2 = [JSON.parse(JSON.stringify(temp))];
    data1[0].children = arr1;
    data2[0].children = arr2;
    var option = {
        title : {
            text: '景泉组织架构图'
        },
        tooltip : {
            trigger: 'item',
            padding: 5,
            formatter: function (params) {
                var res = '景源组织架构图: <br/>&nbsp;&nbsp;' + params.name;
                return res;
            }
        },
        /*toolbox: {
            show : true,
            orient: 'horizontal',      // 布局方式，默认为水平布局，可选为： 'horizontal' ¦ 'vertical'
            x: 50,  // 水平安放位置，默认为全图右对齐，可选为 'center' ¦ 'left' ¦ 'right'
            y: 50,
            itemGap:  10, //各个item之间的间隔
            itemSize: 16, //工具箱icon大小，单位（px）
            feature : {
                myTool : {
                    show : true,
                    title : '自定义扩展方法',
                    icon : 'http://echarts.baidu.com/echarts2/doc/asset/img/echarts-logo.png',
                    onclick : function (){
                        alert('myToolHandler')
                    }
                }
            }
        },*/
        series : [
            {
                name:'树图',
                type:'tree',
                orient: 'horizontal',  // vertical horizontal
                rootLocation:  {x: "500", y: 'center'}, // 根节点位置  {x: 'center',y: 10}
                nodePadding: 10,
                layerPadding: 150,
                //symbol: 'emptyRectangle',
                symbolSize: 15,
                roam: true,
                itemStyle: {
                    normal: {
                        color: "#fff",
                        borderWidth: 1,
                        borderColor: "#8dc63f",
                        label: {
                            show: true,
                            position: 'right',
                            textStyle: {
                                color: '#666767'
                            }
                        },
                        lineStyle: {
                            color: '#8dc63f',
                            width: 1,
                            type: 'curve' // 'curve'|'broken'|'solid'|'dotted'|'dashed' 线的连接方式
                        }
                    },
                    emphasis: {
                        color: '#fff',
                        borderWidth: 2,
                        barBorderColor: "#8dc63f",
                        borderColor: "#8dc63f"
                    }
                },
                data: data1
            },{
                name:'树图',
                type:'tree',
                orient: 'horizontal',  // vertical horizontal
                rootLocation:  {x: "500", y: 'center'}, // 根节点位置  {x: 'center',y: 10}
                nodePadding: 10,
                layerPadding: 150,
                direction: 'inverse',
                symbolSize: 15,
                roam: true,
                itemStyle: {
                    normal: {
                        color: "#fff",
                        borderWidth: 1,
                        borderColor: "#8dc63f",
                        label: {
                            show: true,
                            position: 'left',
                            textStyle: {
                                color: '#666767'
                            }
                        },
                        lineStyle: {
                            color: '#8dc63f',
                            width: 1,
                            type: 'curve' // 'curve'|'broken'|'solid'|'dotted'|'dashed' 线的连接方式
                        }
                    },
                    emphasis: {
                        color: '#fff',
                        borderWidth: 2,
                        barBorderColor: "#8dc63f",
                        borderColor: "#8dc63f"
                    }
                },
                data: data2
            }
        ]
    };
    myChart.setOption(option,true);
}

$(function () {
    $("#add").click(function(e){
        e.preventDefault();
        if(itemSelected == null){
            swal('请选择一个部门');
            return;
        }
        swal({
            title: '添加部门',
            html: '<div class="popout"><label>部门代码</label><input id="departmentCode"/></div>'+'<div class="popout"><label>部门名称</label><input id="departmentName"/></div>',
            showCloseButton: true,
            confirmButtonText: '确定'
        }).then(function () {
            var departmentCode = $("#departmentCode").val();
            var departmentName = $("#departmentName").val();
            if(departmentCode && departmentName) {
                var ajaxData = {
                    departmentCode: departmentCode.trim(),
                    departmentName: departmentName.trim(),
                    parentId: itemSelected.id
                }
                console.log(ajaxData);
                $.ajax({
                  async : true,
                  url : 'newDepartment.do',
                  type : 'POST',
                  dataType : 'json',
                  timeout : '30000',
                  data: ajaxData,
                  success : function(result) {
                    var data=getNodes();
                    setData(myChart,data);
                    itemSelected = null;
                  },
                  error : function(result) {
                    swal('网络错误');
                  }
                });
            }
        })
    })

    $("#delete").click(function(e){
        e.preventDefault();
        if(itemSelected == null){
            swal('请选择一个部门');
            return;
        }
        for (var i = 0; i < zNodes.length; i++) {
            if(zNodes[i].pId == itemSelected.id) {
              swal('请先删除该部门下属部门!');
              return;
            }
        }
        //TODO 提交到后台
        swal({
          text: "确定删除该部门？",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        }).then(function () {
            $.ajax({
              async : true,
              url : 'deleteDepartment.do',
              type : 'POST',
              dataType : 'json',
              timeout : '30000',
              data: {departmentCode: itemSelected.id},
              success : function(result) {
                var data=getNodes();
                setData(myChart,data);
                itemSelected = null;
              },
              error : function(result) {
                swal('网络错误');
              }
            });

        })
    })
})
