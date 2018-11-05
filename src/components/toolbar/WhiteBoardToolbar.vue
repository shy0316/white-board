<template>
  <div class="white-board-toobar-outer">
    <div class="white-board-toobar">
      <ul class="white-board-tools white-board-tools-top">
        <li
          class="white-board-tool"
          v-for="(cmd, idx) in cmds"
          @click="handleCmdClick(cmd)"
          :key="idx"
        >
          <Icon
            color="#fff"
            class="white-board-tool-icon "
            :type="cmd.icon"
            size="24"
          />
        </li>
        <li 
          class="white-board-tool cursor-move" 
          @mousedown="handleMousedown">
          <Icon 
            size="20"
            color="#fff"
            class="white-board-tool-icon "
            type="arrow-move"/>
        </li>
      </ul>
      <ul class="white-board-tools">
        <li
          class="white-board-tool"
          v-for="(tool, idx) in tools"
          :class="tool === curTool ? 'white-board-tool--active' : ''"
          @click="handleToolClick(tool)"
          :key="idx"
        >
          <img
            class="white-board-tool-icon tool-img-icon "
            :src="tool.icon"
          >
        </li>
      </ul>
    </div>
  </div>
  
</template>

<script>
  import {
    TOOL_TYPE_BRUSH,
    TOOL_TYPE_ERASER,
    CMD_CLEAR,
    CMD_UNDO,
    CMD_DRAG
  } from '../../const'

  const TAG = 'white-board/WhiteBoardToolbar'

  export default {
    data () {
      const thinWidth = 1
      const thickWidth = 4

      const cmds = [
        {
          name: '撤销',
          command: CMD_UNDO,
          icon: 'ios-undo'
        },
        {
          name: '清空',
          command: CMD_CLEAR,
          icon: 'ios-trash'
        },
      ]
      const tools = [
        {
          name: '橡皮擦',
          type: TOOL_TYPE_ERASER,
          icon: require('../../static/images/tool-eraser.png')
        },
        {
          name: '黑色-细',
          type: TOOL_TYPE_BRUSH,
          icon: require('../../static/images/tool-pen-black-thin.png'),
          strokeStyle: 'black',
          lineWidth: thinWidth
        },
        {
          name: '蓝色-细',
          type: TOOL_TYPE_BRUSH,
          icon: require('../../static/images/tool-pen-blue-thin.png'),
          strokeStyle: 'blue',
          lineWidth: thinWidth
        },
        {
          name: '红色-细',
          type: TOOL_TYPE_BRUSH,
          icon: require('../../static/images/tool-pen-red-thin.png'),
          strokeStyle: 'red',
          lineWidth: thinWidth
        },
        {
          name: '绿色-细',
          type: TOOL_TYPE_BRUSH,
          icon: require('../../static/images/tool-pen-green-thin.png'),
          strokeStyle: 'green',
          lineWidth: thinWidth
        },
        {
          name: '黑色-粗',
          type: TOOL_TYPE_BRUSH,
          icon: require('../../static/images/tool-pen-black-thick.png'),
          strokeStyle: 'black',
          lineWidth: thickWidth
        },
        {
          name: '蓝色-粗',
          type: TOOL_TYPE_BRUSH,
          icon: require('../../static/images/tool-pen-blue-thick.png'),
          strokeStyle: 'blue',
          lineWidth: thickWidth
        },
        {
          name: '红色-粗',
          type: TOOL_TYPE_BRUSH,
          icon: require('../../static/images/tool-pen-red-thick.png'),
          strokeStyle: 'red',
          lineWidth: thickWidth
        },
        {
          name: '绿色-粗',
          type: TOOL_TYPE_BRUSH,
          icon: require('../../static/images/tool-pen-green-thick.png'),
          strokeStyle: 'green',
          lineWidth: thickWidth
        }
      ]
      return {
        cmds,
        tools,
        curTool: null
      }
    },
    methods: {
      handleToolClick (tool) {
        console.log(TAG,'handleToolClick',tool)
        this.curTool = tool
        this.$emit('on-tool-change', tool)
      },
      handleCmdClick (cmd) {
        this.$emit('on-cmd-click', cmd)
      },
      handleMousedown (e) {
        this.$emit('on-drag-mouse-down',e)
      }
    }
  }
</script>

<style>
.white-board-toobar-outer {
  width: 40px;
  height: 100%;
  z-index: 3;
  overflow: hidden;
  box-shadow: 2px 0px 0px #878888;
}

.white-board-toobar {
  width: 48px;
  height: 100%;
  z-index: 3;
  background-color: rgba(19,19,19,0.8);
  overflow: hidden scroll;
}

.white-board-tools-top {
  border-bottom: 1px solid #878888;
  border-top: 1px solid #878888;
}

.white-board-tool {
  position: relative;
  width: 40px;
  height: 40px;
  cursor: pointer;
}

.white-board-tool--active {
  background-image: none;
  outline: 0;
  border: 1px solid #878888;
}

.white-board-tool-icon {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.tool-img-icon {
  width: 22px;
  height: 22px;
}

.cursor-move {
  cursor: move;
}

</style>
