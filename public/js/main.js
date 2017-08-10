var itemStyle = {};
    itemStyle.normal = {color: "#8dc63f"};
    //itemStyle.normal.label = {textStyle: {color: "#fff"}};
    itemStyle.emphasis = {color: "#8dc63f"};
var itemSelected = {};
var myChart;
var zNodes=[];
var treeData;
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

        treeData=getNodes();
        //console.log(data);



        myChart.on('click', function(param) {
            var tempData = JSON.parse(JSON.stringify(zNodes));
            //console.log(param);
            for (var i = 0; i < zNodes.length; i++) {
                if(tempData[i].name == param.name) {
                    $("#info").text(tempData[i].name);
                    tempData[i].itemStyle = itemStyle;
                    break;
                }
            }
            itemSelected = param.data;
            var mytree=new treeMenu(tempData)
            var childTree = mytree.init(itemSelected.id);
            //console.log(data);
            //console.log("data:"+JSON.stringify(data));
            
            setData(myChart,treeData,[childTree]);
        });
    }
);

function getNodes(){
  $.ajax({
    async : false,
    url : 'departmentList.do',
    type : 'GET',
    dataType : 'json',
    timeout : '30000',
    success : function(result) {
      zNodes = result;
      var mytree=new treeMenu(zNodes)
      var myTreeData = mytree.init("0");//头结点从"0" 开始 只取第一层
    	treeData = myTreeData.children;
      itemSelected = treeData[0];
      itemSelected.itemStyle = itemStyle;
      var firstNode = {};
      for (var i = 0; i < itemSelected.children.length; i++) {
          treeData[0].children[i].children = [];
          if(i == 0) {
              firstNode = treeData[0].children[i];
          }
      }
      setData(myChart,treeData,[firstNode]);
    },
    error : function(result) {
      swal('网络错误');
    }
  });
  return treeData;
}

function setData(myChart,data1,data2){
    if(!data1) data1 = [];
    if(!data2) data2 = [];
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
        series : [
            {
                name:'部门',
                type:'tree',
                orient: 'horizontal',  // vertical horizontal
                rootLocation:  {x: 200, y: 'center'}, // 根节点位置  {x: 'center',y: 10}
                nodePadding: 15,
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
                name:'子部门',
                type:'tree',
                orient: 'horizontal',  // vertical horizontal
                rootLocation:  {x: "600", y: 'center'}, // 根节点位置  {x: 'center',y: 10}
                nodePadding: 20,
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
                    treeData = getNodes();
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
                treeData = getNodes();
                setData(myChart,treeData);
                itemSelected = null;
              },
              error : function(result) {
                swal('网络错误');
              }
            });

        })
    })
})
