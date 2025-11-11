import React, { useMemo } from "react"
import { View, Text, StyleSheet, Dimensions } from "react-native"
import Svg, { G, Circle, Text as SvgText } from "react-native-svg"

export type DonutSlice = {
  label: string
  value: number
  color?: string
}

export type DonutChartProps = {
  data: DonutSlice[]
  size?: number // diameter in px
  thickness?: number // ring thickness
  showPercent?: boolean
}

const DEFAULT_COLORS = ["#0F5B5C", "#12C48B", "#FFB020", "#7C4DFF", "#FF6B6B", "#3AA9FF"]

function polarToCartesian(cx: number, cy: number, r: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  }
}

function isDarkColor(hex?: string) {
  if (!hex) return true
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const int = parseInt(full, 16)
  const r = (int >> 16) & 255
  const g = (int >> 8) & 255
  const b = int & 255
  // perceived brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness < 150
}

export default function DonutChart({
  data,
  size = 160,
  thickness = 20,
  showPercent = true,
}: DonutChartProps) {
  // make size responsive to screen width so donut doesn't overflow on small devices
  const windowWidth = Dimensions.get('window').width
  const legendWidth = 120
  const horizontalPadding = 48 // approximate surrounding paddings in layouts
  const maxAvailable = Math.max(80, windowWidth - horizontalPadding - legendWidth - 24)
  const finalSize = Math.min(size, maxAvailable)
  const total = useMemo(() => data.reduce((s, i) => s + Math.max(0, i.value), 0), [data])

  const cx = finalSize / 2
  const cy = finalSize / 2
  const radius = Math.max(8, finalSize / 2 - thickness / 2 - 8)
  const circumference = 2 * Math.PI * radius

  // prepare slices with percent and angle
  const slices = useMemo(() => {
    const palette = DEFAULT_COLORS
    let acc = 0
    return data.map((d, idx) => {
      const value = Math.max(0, d.value)
      const percent = total > 0 ? (value / total) * 100 : 0
      const length = circumference * (percent / 100)
      const slice = {
        ...d,
        color: d.color ?? palette[idx % palette.length],
        value,
        percent,
        length,
        offset: acc,
      }
      acc += length
      return slice
    })
  }, [data, total, circumference])

  // legend width reserved to the right
  

  return (
    <View style={[styles.container, { width: finalSize + legendWidth, height: finalSize }]}> 
      <Svg width={finalSize} height={finalSize}>
        <G rotation={0} originX={cx} originY={cy}>
          {/* background ring */}
          <Circle cx={cx} cy={cy} r={radius} stroke="#F3F6F7" strokeWidth={thickness} fill="none" />

          {/* slices drawn as stroked circles using strokeDasharray */}
          {slices.map((s, i) => {
            const dashArray = `${s.length} ${Math.max(0, circumference - s.length)}`
            // strokeDashoffset moves the dash; negative offset advances clockwise
            const dashOffset = -s.offset
            return (
              <Circle
                key={`slice-${i}`}
                cx={cx}
                cy={cy}
                r={radius}
                stroke={s.color}
                strokeWidth={thickness}
                strokeLinecap="butt"
                fill="none"
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                transform={`rotate(-90 ${cx} ${cy})`}
              />
            )
          })}

          {/* inner percentage labels (one per slice) */}
          {slices.map((s, i) => {
            const midOffset = s.offset + s.length / 2
            const midAngle = (midOffset / circumference) * 360
            const innerLabelR = radius // center of the ring
            const innerLabelPos = polarToCartesian(cx, cy, innerLabelR, midAngle)
            const percentText = `${s.percent.toFixed(0)}%`
            const percentFill = isDarkColor(s.color) ? '#FFFFFF' : '#12343A'

            return (
              <SvgText
                key={`inner-${i}`}
                x={innerLabelPos.x}
                y={innerLabelPos.y + 4}
                fontSize={12}
                fill={percentFill}
                fontWeight="700"
                textAnchor="middle"
              >
                {percentText}
              </SvgText>
            )
          })}
        </G>
      </Svg>

      {/* legend to the right for better readability */}
      <View style={styles.legend}>
        {slices.map((s, i) => (
          <View key={`legend-${i}`} style={styles.legendRow}>
            <View style={[styles.swatch, { backgroundColor: s.color }]} />
            <View style={styles.legendTextWrap}>
              <Text style={styles.legendLabel}>{s.label}</Text>
              <Text style={styles.legendPercent}>{s.percent.toFixed(1)}%</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  legend: {
    marginLeft: 12,
    width: 120,
    justifyContent: 'center'
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  swatch: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendTextWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  legendLabel: {
    fontSize: 13,
    color: '#12343A',
  },
  legendPercent: {
    fontSize: 13,
    color: '#12343A',
    fontWeight: '600'
  }
})
