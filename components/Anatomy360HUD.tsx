'use client';

import React, { useState, useEffect } from 'react';
import { RotateCw, Play, Pause, Zap, Plus } from 'lucide-react';
import { useWorkout } from '@/context/WorkoutContext';
import { MuscleGroup } from '@/types/workout';
import { QuickLogModal } from '@/components/QuickLogModal';

/* ─────────────────────────────────────────────
   Hyper-detailed anatomical SVG paths.
   Each muscle group is a collection of outline
   + fiber/striation lines that together produce
   a realistic wireframe look matching the
   reference image.
   ───────────────────────────────────────────── */

const FRONT_BODY_OUTLINE = `
  M 200 18 C 188 18 178 24 174 36 C 170 48 172 60 178 68 C 172 66 168 64 164 66
  C 166 68 168 72 170 76 C 174 80 180 84 188 86
  L 186 90 L 184 96
  C 178 98 170 100 162 104 C 152 108 142 114 136 120
  C 128 128 122 136 120 144 C 116 152 112 164 110 176
  C 108 188 104 200 102 210 L 98 228 L 96 240 L 94 252
  C 92 260 92 268 94 272 L 96 276 L 92 280 L 88 286
  C 86 290 84 296 84 302 L 86 308
  C 88 312 90 316 92 318 L 94 320
  L 152 280 L 162 276
  C 168 272 174 270 180 268 L 188 266 L 192 264
  L 192 286 L 190 310 L 186 340 L 182 370
  L 178 400 L 174 430 L 170 458 L 168 474
  C 166 482 164 490 164 496 L 164 502 L 168 506
  C 172 510 178 512 186 512 L 192 510 L 196 504
  L 198 498 L 200 490
  L 202 498 L 204 504 L 208 510 L 214 512
  C 222 512 228 510 232 506 L 236 502 L 236 496
  C 236 490 234 482 232 474 L 230 458 L 226 430
  L 222 400 L 218 370 L 214 340 L 210 310 L 208 286
  L 208 264 L 212 266 L 220 268
  C 226 270 232 272 238 276 L 248 280 L 306 320
  L 308 318 C 310 316 312 312 314 308 L 316 302
  C 316 296 314 290 312 286 L 308 280 L 304 276 L 306 272
  C 308 268 308 260 306 252 L 304 240 L 302 228 L 298 210
  C 296 200 292 188 290 176 C 288 164 284 152 280 144
  C 278 136 272 128 264 120 C 258 114 248 108 238 104
  C 230 100 222 98 216 96 L 214 90 L 212 86
  C 220 84 226 80 230 76 C 232 72 234 68 236 66
  C 232 64 228 66 222 68 C 228 60 230 48 226 36
  C 222 24 212 18 200 18 Z
`;

// Front view detailed anatomy: all the inner muscle lines
const FrontAnatomyPaths = ({ activeMuscle }: { activeMuscle: MuscleGroup }) => {
  const chestFill = activeMuscle === 'chest' ? 'rgba(0,240,255,0.35)' : 'rgba(0,240,255,0.06)';
  const absFill = activeMuscle === 'abs' ? 'rgba(0,240,255,0.35)' : 'rgba(0,240,255,0.06)';
  const shoulderFill = activeMuscle === 'shoulders' ? 'rgba(0,240,255,0.35)' : 'rgba(0,240,255,0.06)';
  const bicepFill = activeMuscle === 'biceps' ? 'rgba(0,240,255,0.35)' : 'rgba(0,240,255,0.06)';
  const quadFill = activeMuscle === 'quads' ? 'rgba(0,240,255,0.35)' : 'rgba(0,240,255,0.06)';

  return (
    <g stroke="#00d4ff" fill="none">
      {/* ── HEAD & FACE ── */}
      <g strokeWidth="1.2">
        {/* Skull outline */}
        <path d="M 200 18 C 185 18 175 28 174 40 C 173 52 176 62 182 68 C 188 74 194 76 200 76 C 206 76 212 74 218 68 C 224 62 227 52 226 40 C 225 28 215 18 200 18" strokeWidth="1.6" />
        {/* Forehead line */}
        <path d="M 180 32 Q 200 26 220 32" />
        {/* Brow ridge */}
        <path d="M 182 40 Q 190 36 200 38 Q 210 36 218 40" />
        {/* Eyes */}
        <ellipse cx="190" cy="44" rx="6" ry="3" />
        <ellipse cx="210" cy="44" rx="6" ry="3" />
        {/* Nose */}
        <path d="M 200 38 L 198 52 Q 196 56 200 57 Q 204 56 202 52 L 200 38" />
        {/* Mouth / jaw */}
        <path d="M 192 62 Q 200 66 208 62" />
        <path d="M 186 68 Q 200 74 214 68" />
        {/* Ears */}
        <path d="M 174 40 C 170 40 168 48 170 54 C 172 58 174 56 174 52" />
        <path d="M 226 40 C 230 40 232 48 230 54 C 228 58 226 56 226 52" />
        {/* Jaw lines */}
        <path d="M 178 58 C 182 68 190 74 200 76" />
        <path d="M 222 58 C 218 68 210 74 200 76" />
      </g>

      {/* ── NECK ── */}
      <g strokeWidth="1.1">
        <path d="M 188 76 L 184 96" />
        <path d="M 212 76 L 216 96" />
        {/* Sternocleidomastoid */}
        <path d="M 190 78 C 186 84 182 90 180 98" />
        <path d="M 210 78 C 214 84 218 90 220 98" />
        {/* Center neck line */}
        <line x1="200" y1="76" x2="200" y2="96" strokeDasharray="2,3" strokeOpacity="0.5" />
      </g>

      {/* ── TRAPEZIUS (upper) ── */}
      <g strokeWidth="1">
        <path d="M 184 96 C 172 100 160 106 148 112" />
        <path d="M 216 96 C 228 100 240 106 252 112" />
        <path d="M 186 98 C 176 102 166 108 156 116" />
        <path d="M 214 98 C 224 102 234 108 244 116" />
      </g>

      {/* ── DELTOIDS (shoulders) ── */}
      <g strokeWidth="1.3">
        {/* Left deltoid outer contour */}
        <path d="M 148 112 C 138 116 130 124 126 134 C 124 140 124 146 126 150" fill={shoulderFill} />
        {/* Left deltoid fibers */}
        <path d="M 150 114 C 142 122 136 132 134 140" strokeWidth="0.8" />
        <path d="M 152 116 C 146 124 140 134 138 144" strokeWidth="0.8" />
        <path d="M 146 110 C 136 118 128 130 126 142" strokeWidth="0.8" />
        {/* Left deltoid separation line */}
        <path d="M 148 112 C 140 130 136 148 140 158" strokeWidth="1" />
        
        {/* Right deltoid outer contour */}
        <path d="M 252 112 C 262 116 270 124 274 134 C 276 140 276 146 274 150" fill={shoulderFill} />
        {/* Right deltoid fibers */}
        <path d="M 250 114 C 258 122 264 132 266 140" strokeWidth="0.8" />
        <path d="M 248 116 C 254 124 260 134 262 144" strokeWidth="0.8" />
        <path d="M 254 110 C 264 118 272 130 274 142" strokeWidth="0.8" />
        <path d="M 252 112 C 260 130 264 148 260 158" strokeWidth="1" />
      </g>

      {/* ── CLAVICLE & STERNUM ── */}
      <g strokeWidth="1.2">
        <path d="M 148 112 C 164 106 180 102 200 100 C 220 102 236 106 252 112" />
        {/* Sternum center line */}
        <line x1="200" y1="100" x2="200" y2="180" strokeWidth="0.8" strokeOpacity="0.6" />
        {/* Clavicle details */}
        <path d="M 200 102 C 192 104 176 108 160 114" strokeWidth="0.8" />
        <path d="M 200 102 C 208 104 224 108 240 114" strokeWidth="0.8" />
      </g>

      {/* ── PECTORALS (chest) ── */}
      <g strokeWidth="1.2">
        {/* Left pec outline */}
        <path d="M 152 116 C 162 120 180 128 196 140 C 198 154 196 168 184 176 C 170 182 154 178 144 168 C 138 158 136 146 140 134" fill={chestFill} />
        {/* Left pec fiber striations */}
        <path d="M 154 122 C 168 130 184 140 192 148" strokeWidth="0.7" />
        <path d="M 150 130 C 164 138 180 148 190 156" strokeWidth="0.7" />
        <path d="M 148 138 C 160 146 174 156 186 164" strokeWidth="0.7" />
        <path d="M 146 148 C 156 156 168 164 182 172" strokeWidth="0.7" />
        <path d="M 144 158 C 154 164 164 170 178 176" strokeWidth="0.7" />
        {/* Left pec lower border */}
        <path d="M 142 168 C 156 178 172 182 188 178 C 194 174 196 166 196 158" strokeWidth="1" />
        
        {/* Right pec outline */}
        <path d="M 248 116 C 238 120 220 128 204 140 C 202 154 204 168 216 176 C 230 182 246 178 256 168 C 262 158 264 146 260 134" fill={chestFill} />
        {/* Right pec fiber striations */}
        <path d="M 246 122 C 232 130 216 140 208 148" strokeWidth="0.7" />
        <path d="M 250 130 C 236 138 220 148 210 156" strokeWidth="0.7" />
        <path d="M 252 138 C 240 146 226 156 214 164" strokeWidth="0.7" />
        <path d="M 254 148 C 244 156 232 164 218 172" strokeWidth="0.7" />
        <path d="M 256 158 C 246 164 236 170 222 176" strokeWidth="0.7" />
        {/* Right pec lower border */}
        <path d="M 258 168 C 244 178 228 182 212 178 C 206 174 204 166 204 158" strokeWidth="1" />
      </g>

      {/* ── SERRATUS ANTERIOR ── */}
      <g strokeWidth="0.8">
        <path d="M 142 164 C 148 168 154 174 158 180" />
        <path d="M 140 172 C 146 176 152 182 156 188" />
        <path d="M 138 180 C 144 184 150 190 154 196" />
        <path d="M 258 164 C 252 168 246 174 242 180" />
        <path d="M 260 172 C 254 176 248 182 244 188" />
        <path d="M 262 180 C 256 184 250 190 246 196" />
      </g>

      {/* ── BICEPS ── */}
      <g strokeWidth="1.2">
        {/* Left bicep */}
        <path d="M 126 150 C 122 160 116 176 112 192 C 110 204 114 212 120 216 C 126 212 132 200 130 186 C 130 172 128 160 126 150" fill={bicepFill} />
        <path d="M 124 156 C 120 170 116 186 114 200" strokeWidth="0.7" />
        <path d="M 128 154 C 126 168 122 184 120 198" strokeWidth="0.7" />
        {/* Left forearm */}
        <path d="M 114 212 C 108 228 102 248 98 264 C 96 274 94 284 94 290" strokeWidth="1" />
        <path d="M 120 216 C 116 230 112 248 108 264 C 106 274 104 282 102 288" strokeWidth="1" />
        <path d="M 116 218 C 112 232 106 252 102 268" strokeWidth="0.6" />
        <path d="M 112 214 C 106 234 100 258 96 278" strokeWidth="0.6" />
        
        {/* Right bicep */}
        <path d="M 274 150 C 278 160 284 176 288 192 C 290 204 286 212 280 216 C 274 212 268 200 270 186 C 270 172 272 160 274 150" fill={bicepFill} />
        <path d="M 276 156 C 280 170 284 186 286 200" strokeWidth="0.7" />
        <path d="M 272 154 C 274 168 278 184 280 198" strokeWidth="0.7" />
        {/* Right forearm */}
        <path d="M 286 212 C 292 228 298 248 302 264 C 304 274 306 284 306 290" strokeWidth="1" />
        <path d="M 280 216 C 284 230 288 248 292 264 C 294 274 296 282 298 288" strokeWidth="1" />
        <path d="M 284 218 C 288 232 294 252 298 268" strokeWidth="0.6" />
        <path d="M 288 214 C 294 234 300 258 304 278" strokeWidth="0.6" />
      </g>

      {/* ── HANDS (Simplified but realistic) ── */}
      <g strokeWidth="0.9">
        {/* Left hand */}
        <path d="M 92 290 C 88 296 84 304 84 310 C 84 316 88 320 94 320" />
        <path d="M 94 290 L 90 304 L 86 316" />
        <path d="M 96 292 L 92 308" />
        <path d="M 86 304 L 82 312 L 80 318" strokeWidth="0.7" />
        <path d="M 88 300 L 84 310 L 82 316" strokeWidth="0.7" />
        <path d="M 90 296 L 88 306 L 86 314" strokeWidth="0.7" />
        <path d="M 94 294 L 94 310 L 94 318" strokeWidth="0.7" />
        
        {/* Right hand */}
        <path d="M 308 290 C 312 296 316 304 316 310 C 316 316 312 320 306 320" />
        <path d="M 306 290 L 310 304 L 314 316" />
        <path d="M 304 292 L 308 308" />
        <path d="M 314 304 L 318 312 L 320 318" strokeWidth="0.7" />
        <path d="M 312 300 L 316 310 L 318 316" strokeWidth="0.7" />
        <path d="M 310 296 L 312 306 L 314 314" strokeWidth="0.7" />
        <path d="M 306 294 L 306 310 L 306 318" strokeWidth="0.7" />
      </g>

      {/* ── RECTUS ABDOMINIS (6-pack) ── */}
      <g strokeWidth="1">
        {/* Outer ab contour */}
        <path d="M 184 178 C 188 180 194 182 200 182 C 206 182 212 180 216 178" fill={absFill} />
        <path d="M 184 178 L 180 200 L 178 224 L 176 248 L 178 266" fill={absFill} />
        <path d="M 216 178 L 220 200 L 222 224 L 224 248 L 222 266" fill={absFill} />
        {/* Linea alba (center line) */}
        <line x1="200" y1="182" x2="200" y2="268" strokeWidth="1.2" />
        {/* Tendinous inscriptions (horizontal ab separations) */}
        <path d="M 182 196 Q 200 192 218 196" strokeWidth="1" />
        <path d="M 180 216 Q 200 212 220 216" strokeWidth="1" />
        <path d="M 178 236 Q 200 232 222 236" strokeWidth="1" />
        <path d="M 178 254 Q 200 250 222 254" strokeWidth="1" />
        {/* Outer ab border lines */}
        <path d="M 182 186 C 172 196 166 212 162 230 C 158 248 160 262 164 272" strokeWidth="0.8" />
        <path d="M 218 186 C 228 196 234 212 238 230 C 242 248 240 262 236 272" strokeWidth="0.8" />
      </g>

      {/* ── OBLIQUES ── */}
      <g strokeWidth="0.7">
        <path d="M 160 190 C 166 196 172 200 178 202" />
        <path d="M 156 200 C 162 206 168 212 176 214" />
        <path d="M 154 212 C 160 218 166 224 174 226" />
        <path d="M 152 224 C 158 230 164 236 174 238" />
        <path d="M 240 190 C 234 196 228 200 222 202" />
        <path d="M 244 200 C 238 206 232 212 224 214" />
        <path d="M 246 212 C 240 218 234 224 226 226" />
        <path d="M 248 224 C 242 230 236 236 226 238" />
      </g>

      {/* ── HIP / PELVIS ── */}
      <g strokeWidth="1">
        <path d="M 164 268 C 172 274 184 278 200 280 C 216 278 228 274 236 268" />
        <path d="M 162 272 C 156 278 152 282 150 286" />
        <path d="M 238 272 C 244 278 248 282 250 286" />
        {/* Inguinal ligament */}
        <path d="M 164 268 C 172 280 180 288 190 292" strokeWidth="0.8" />
        <path d="M 236 268 C 228 280 220 288 210 292" strokeWidth="0.8" />
      </g>

      {/* ── QUADRICEPS ── */}
      <g strokeWidth="1.1">
        {/* Left quad group outline */}
        <path d="M 150 286 C 146 310 142 340 140 370 C 138 392 140 408 144 418" fill={quadFill} />
        <path d="M 192 288 C 192 310 190 340 188 370 C 186 392 184 408 182 418" fill={quadFill} />
        {/* Rectus femoris (center quad) */}
        <path d="M 174 288 C 170 310 166 340 164 370 C 162 390 164 406 168 416" strokeWidth="0.8" />
        {/* Vastus lateralis (outer) */}
        <path d="M 152 290 C 148 316 144 346 142 376" strokeWidth="0.8" />
        <path d="M 156 292 C 152 320 148 352 146 380" strokeWidth="0.7" />
        {/* Vastus medialis (inner teardrop) */}
        <path d="M 186 290 C 184 316 182 346 180 376 C 178 392 174 404 168 416" strokeWidth="0.8" />
        <path d="M 188 294 C 186 322 184 354 182 382" strokeWidth="0.7" />
        {/* Sartorius line */}
        <path d="M 178 288 C 172 310 164 340 158 370 C 154 392 150 408 148 418" strokeWidth="0.6" strokeDasharray="4,3" />
        
        {/* Right quad group outline */}
        <path d="M 250 286 C 254 310 258 340 260 370 C 262 392 260 408 256 418" fill={quadFill} />
        <path d="M 208 288 C 208 310 210 340 212 370 C 214 392 216 408 218 418" fill={quadFill} />
        {/* Rectus femoris */}
        <path d="M 226 288 C 230 310 234 340 236 370 C 238 390 236 406 232 416" strokeWidth="0.8" />
        {/* Vastus lateralis */}
        <path d="M 248 290 C 252 316 256 346 258 376" strokeWidth="0.8" />
        <path d="M 244 292 C 248 320 252 352 254 380" strokeWidth="0.7" />
        {/* Vastus medialis */}
        <path d="M 214 290 C 216 316 218 346 220 376 C 222 392 226 404 232 416" strokeWidth="0.8" />
        <path d="M 212 294 C 214 322 216 354 218 382" strokeWidth="0.7" />
        {/* Sartorius */}
        <path d="M 222 288 C 228 310 236 340 242 370 C 246 392 250 408 252 418" strokeWidth="0.6" strokeDasharray="4,3" />
      </g>

      {/* ── KNEES ── */}
      <g strokeWidth="0.9">
        <path d="M 144 418 C 150 424 160 428 170 428 C 178 428 184 424 188 418" />
        <circle cx="166" cy="422" r="8" strokeWidth="0.8" />
        <path d="M 256 418 C 250 424 240 428 230 428 C 222 428 216 424 212 418" />
        <circle cx="234" cy="422" r="8" strokeWidth="0.8" />
      </g>

      {/* ── TIBIALIS / SHIN ── */}
      <g strokeWidth="0.9">
        {/* Left lower leg */}
        <path d="M 148 428 C 144 448 140 472 138 492 C 138 502 142 510 148 514" />
        <path d="M 184 428 C 182 448 178 472 176 492 C 176 502 174 510 170 514" />
        <path d="M 160 428 C 156 448 152 472 150 492" strokeWidth="0.7" />
        <path d="M 170 428 C 168 450 164 474 162 494" strokeWidth="0.7" />
        {/* Tibialis anterior */}
        <path d="M 164 430 C 160 450 156 474 154 496" strokeWidth="0.6" />
        {/* Calf front visible line */}
        <path d="M 152 432 C 148 454 144 478 142 498" strokeWidth="0.6" />
        
        {/* Right lower leg */}
        <path d="M 252 428 C 256 448 260 472 262 492 C 262 502 258 510 252 514" />
        <path d="M 216 428 C 218 448 222 472 224 492 C 224 502 226 510 230 514" />
        <path d="M 240 428 C 244 448 248 472 250 492" strokeWidth="0.7" />
        <path d="M 230 428 C 232 450 236 474 238 494" strokeWidth="0.7" />
        <path d="M 236 430 C 240 450 244 474 246 496" strokeWidth="0.6" />
        <path d="M 248 432 C 252 454 256 478 258 498" strokeWidth="0.6" />
      </g>

      {/* ── FEET ── */}
      <g strokeWidth="0.9">
        {/* Left foot */}
        <path d="M 148 514 C 146 518 140 522 134 524 C 130 524 128 520 130 516" />
        <path d="M 170 514 C 172 518 174 522 172 524" />
        <path d="M 140 520 L 136 524" strokeWidth="0.6" />
        <path d="M 144 518 L 140 524" strokeWidth="0.6" />
        <path d="M 148 516 L 146 524" strokeWidth="0.6" />
        <path d="M 156 516 L 156 524" strokeWidth="0.6" />
        <path d="M 162 516 L 164 524" strokeWidth="0.6" />
        
        {/* Right foot */}
        <path d="M 252 514 C 254 518 260 522 266 524 C 270 524 272 520 270 516" />
        <path d="M 230 514 C 228 518 226 522 228 524" />
        <path d="M 260 520 L 264 524" strokeWidth="0.6" />
        <path d="M 256 518 L 260 524" strokeWidth="0.6" />
        <path d="M 252 516 L 254 524" strokeWidth="0.6" />
        <path d="M 244 516 L 244 524" strokeWidth="0.6" />
        <path d="M 238 516 L 236 524" strokeWidth="0.6" />
      </g>
    </g>
  );
};

// Back view detailed anatomy
const BackAnatomyPaths = ({ activeMuscle }: { activeMuscle: MuscleGroup }) => {
  const backFill = activeMuscle === 'back' ? 'rgba(0,240,255,0.35)' : 'rgba(0,240,255,0.06)';
  const tricepFill = activeMuscle === 'triceps' ? 'rgba(0,240,255,0.35)' : 'rgba(0,240,255,0.06)';
  const hamFill = activeMuscle === 'hamstrings' ? 'rgba(0,240,255,0.35)' : 'rgba(0,240,255,0.06)';
  const calveFill = activeMuscle === 'calves' ? 'rgba(0,240,255,0.35)' : 'rgba(0,240,255,0.06)';

  return (
    <g stroke="#00d4ff" fill="none">
      {/* ── HEAD (back view) ── */}
      <g strokeWidth="1.2">
        <path d="M 200 18 C 185 18 175 28 174 40 C 173 52 176 62 182 68 C 188 74 194 76 200 76 C 206 76 212 74 218 68 C 224 62 227 52 226 40 C 225 28 215 18 200 18" strokeWidth="1.6" />
        {/* Back of skull lines */}
        <path d="M 180 30 Q 200 24 220 30" strokeWidth="0.8" />
        <path d="M 178 42 Q 200 36 222 42" strokeWidth="0.8" />
        {/* Spine center */}
        <line x1="200" y1="76" x2="200" y2="280" strokeWidth="1.2" strokeDasharray="3,2" strokeOpacity="0.6" />
      </g>

      {/* ── NECK (back) ── */}
      <g strokeWidth="1">
        <path d="M 188 76 L 184 96" />
        <path d="M 212 76 L 216 96" />
        <path d="M 194 76 L 192 94" strokeWidth="0.7" />
        <path d="M 206 76 L 208 94" strokeWidth="0.7" />
      </g>

      {/* ── TRAPEZIUS ── */}
      <g strokeWidth="1.1">
        {/* Trap diamond outline */}
        <path d="M 184 96 C 172 100 156 108 144 118 C 156 124 172 128 188 130" fill={backFill} />
        <path d="M 216 96 C 228 100 244 108 256 118 C 244 124 228 128 212 130" fill={backFill} />
        {/* Trap fiber lines */}
        <path d="M 188 98 C 178 104 164 112 152 120" strokeWidth="0.7" />
        <path d="M 192 100 C 182 108 168 116 156 124" strokeWidth="0.7" />
        <path d="M 196 102 C 186 112 172 120 160 128" strokeWidth="0.7" />
        <path d="M 212 98 C 222 104 236 112 248 120" strokeWidth="0.7" />
        <path d="M 208 100 C 218 108 232 116 244 124" strokeWidth="0.7" />
        <path d="M 204 102 C 214 112 228 120 240 128" strokeWidth="0.7" />
        {/* Lower trap fibers */}
        <path d="M 200 130 C 196 150 194 170 196 186" strokeWidth="0.8" />
        <path d="M 200 130 C 204 150 206 170 204 186" strokeWidth="0.8" />
      </g>

      {/* ── REAR DELTOIDS ── */}
      <g strokeWidth="1.2">
        <path d="M 144 118 C 136 122 128 130 126 140 C 124 150 128 156 134 158" />
        <path d="M 256 118 C 264 122 272 130 274 140 C 276 150 272 156 266 158" />
        <path d="M 142 122 C 134 130 130 140 130 148" strokeWidth="0.7" />
        <path d="M 258 122 C 266 130 270 140 270 148" strokeWidth="0.7" />
      </g>

      {/* ── LATISSIMUS DORSI (V-taper) ── */}
      <g strokeWidth="1.1">
        {/* Left lat */}
        <path d="M 188 130 C 180 140 168 158 158 178 C 148 198 144 218 148 238 C 154 252 164 260 178 266" fill={backFill} />
        {/* Left lat fibers */}
        <path d="M 186 134 C 176 150 164 172 156 194" strokeWidth="0.6" />
        <path d="M 184 140 C 174 156 162 180 154 204" strokeWidth="0.6" />
        <path d="M 180 148 C 170 164 160 188 152 212" strokeWidth="0.6" />
        <path d="M 176 156 C 166 174 158 198 152 222" strokeWidth="0.6" />
        <path d="M 172 164 C 162 182 156 206 152 230" strokeWidth="0.6" />
        
        {/* Right lat */}
        <path d="M 212 130 C 220 140 232 158 242 178 C 252 198 256 218 252 238 C 246 252 236 260 222 266" fill={backFill} />
        {/* Right lat fibers */}
        <path d="M 214 134 C 224 150 236 172 244 194" strokeWidth="0.6" />
        <path d="M 216 140 C 226 156 238 180 246 204" strokeWidth="0.6" />
        <path d="M 220 148 C 230 164 240 188 248 212" strokeWidth="0.6" />
        <path d="M 224 156 C 234 174 242 198 248 222" strokeWidth="0.6" />
        <path d="M 228 164 C 238 182 244 206 248 230" strokeWidth="0.6" />
      </g>

      {/* ── INFRASPINATUS / TERES ── */}
      <g strokeWidth="0.8">
        <path d="M 152 130 C 160 140 168 148 176 152" />
        <path d="M 150 138 C 158 148 166 156 174 160" />
        <path d="M 248 130 C 240 140 232 148 224 152" />
        <path d="M 250 138 C 242 148 234 156 226 160" />
      </g>

      {/* ── TRICEPS ── */}
      <g strokeWidth="1.2">
        {/* Left tricep */}
        <path d="M 126 150 C 120 164 114 182 112 198 C 110 210 114 218 120 220" fill={tricepFill} />
        <path d="M 134 158 C 130 170 126 186 124 200 C 122 210 124 216 128 220" fill={tricepFill} />
        {/* Tricep fibers */}
        <path d="M 128 154 C 124 168 118 186 116 202" strokeWidth="0.7" />
        <path d="M 132 158 C 128 172 124 190 122 206" strokeWidth="0.7" />
        {/* Left forearm */}
        <path d="M 116 220 C 110 236 104 256 100 274 C 98 284 96 292 94 298" strokeWidth="1" />
        <path d="M 124 220 C 120 236 114 256 110 274 C 108 284 106 292 104 298" strokeWidth="1" />
        
        {/* Right tricep */}
        <path d="M 274 150 C 280 164 286 182 288 198 C 290 210 286 218 280 220" fill={tricepFill} />
        <path d="M 266 158 C 270 170 274 186 276 200 C 278 210 276 216 272 220" fill={tricepFill} />
        <path d="M 272 154 C 276 168 282 186 284 202" strokeWidth="0.7" />
        <path d="M 268 158 C 272 172 276 190 278 206" strokeWidth="0.7" />
        {/* Right forearm */}
        <path d="M 284 220 C 290 236 296 256 300 274 C 302 284 304 292 306 298" strokeWidth="1" />
        <path d="M 276 220 C 280 236 286 256 290 274 C 292 284 294 292 296 298" strokeWidth="1" />
      </g>

      {/* ── HANDS (back view) ── */}
      <g strokeWidth="0.8">
        <path d="M 92 298 C 88 306 84 314 86 318" />
        <path d="M 104 298 C 100 306 96 314 94 318" />
        <path d="M 90 304 L 86 316" strokeWidth="0.6" />
        <path d="M 96 302 L 92 316" strokeWidth="0.6" />
        <path d="M 308 298 C 312 306 316 314 314 318" />
        <path d="M 296 298 C 300 306 304 314 306 318" />
        <path d="M 310 304 L 314 316" strokeWidth="0.6" />
        <path d="M 304 302 L 308 316" strokeWidth="0.6" />
      </g>

      {/* ── ERECTOR SPINAE ── */}
      <g strokeWidth="0.8">
        <path d="M 194 130 C 192 160 190 200 190 240 C 190 260 192 272 196 280" />
        <path d="M 206 130 C 208 160 210 200 210 240 C 210 260 208 272 204 280" />
        <path d="M 192 140 C 190 170 188 210 188 250" strokeWidth="0.6" />
        <path d="M 208 140 C 210 170 212 210 212 250" strokeWidth="0.6" />
      </g>

      {/* ── GLUTES & HIP ── */}
      <g strokeWidth="1">
        <path d="M 178 266 C 172 274 162 280 154 286" />
        <path d="M 222 266 C 228 274 238 280 246 286" />
        {/* Glute contours */}
        <path d="M 154 278 C 162 286 174 292 188 296 C 194 296 198 294 200 290" fill={hamFill} />
        <path d="M 246 278 C 238 286 226 292 212 296 C 206 296 202 294 200 290" fill={hamFill} />
        <path d="M 158 280 C 168 290 180 296 192 298" strokeWidth="0.7" />
        <path d="M 242 280 C 232 290 220 296 208 298" strokeWidth="0.7" />
      </g>

      {/* ── HAMSTRINGS ── */}
      <g strokeWidth="1.1">
        {/* Left hamstring group */}
        <path d="M 154 296 C 150 320 146 350 144 378 C 142 400 144 414 148 420" fill={hamFill} />
        <path d="M 192 296 C 190 320 188 350 186 378 C 184 400 182 414 180 420" fill={hamFill} />
        {/* Biceps femoris */}
        <path d="M 156 298 C 152 326 148 358 146 388" strokeWidth="0.7" />
        {/* Semitendinosus */}
        <path d="M 172 296 C 168 324 164 356 162 386 C 160 402 158 414 156 420" strokeWidth="0.7" />
        {/* Semimembranosus */}
        <path d="M 184 296 C 182 324 178 356 176 386" strokeWidth="0.7" />
        {/* Center separation */}
        <path d="M 174 298 C 170 330 166 366 164 398" strokeWidth="0.6" />
        
        {/* Right hamstring group */}
        <path d="M 246 296 C 250 320 254 350 256 378 C 258 400 256 414 252 420" fill={hamFill} />
        <path d="M 208 296 C 210 320 212 350 214 378 C 216 400 218 414 220 420" fill={hamFill} />
        <path d="M 244 298 C 248 326 252 358 254 388" strokeWidth="0.7" />
        <path d="M 228 296 C 232 324 236 356 238 386 C 240 402 242 414 244 420" strokeWidth="0.7" />
        <path d="M 216 296 C 218 324 222 356 224 386" strokeWidth="0.7" />
        <path d="M 226 298 C 230 330 234 366 236 398" strokeWidth="0.7" />
      </g>

      {/* ── CALVES (Gastrocnemius) ── */}
      <g strokeWidth="1.1">
        {/* Left calf */}
        <path d="M 148 420 C 142 434 138 452 140 470 C 142 484 146 494 152 500" fill={calveFill} />
        <path d="M 180 420 C 182 434 182 452 180 470 C 178 484 174 494 170 500" fill={calveFill} />
        {/* Calf belly contours */}
        <path d="M 150 424 C 146 440 144 458 146 476" strokeWidth="0.7" />
        <path d="M 164 422 C 162 440 160 460 160 478" strokeWidth="0.7" />
        <path d="M 174 422 C 176 440 176 460 174 478" strokeWidth="0.7" />
        {/* Calf separation */}
        <path d="M 158 420 C 154 440 152 464 154 486" strokeWidth="0.8" />
        {/* Achilles */}
        <path d="M 156 490 C 158 500 160 508 160 514" strokeWidth="0.9" />
        
        {/* Right calf */}
        <path d="M 252 420 C 258 434 262 452 260 470 C 258 484 254 494 248 500" fill={calveFill} />
        <path d="M 220 420 C 218 434 218 452 220 470 C 222 484 226 494 230 500" fill={calveFill} />
        <path d="M 250 424 C 254 440 256 458 254 476" strokeWidth="0.7" />
        <path d="M 236 422 C 238 440 240 460 240 478" strokeWidth="0.7" />
        <path d="M 226 422 C 224 440 224 460 226 478" strokeWidth="0.7" />
        <path d="M 242 420 C 246 440 248 464 246 486" strokeWidth="0.8" />
        <path d="M 244 490 C 242 500 240 508 240 514" strokeWidth="0.9" />
      </g>

      {/* ── FEET (back view) ── */}
      <g strokeWidth="0.8">
        <path d="M 152 514 C 148 518 142 522 138 524 C 134 524 132 520 134 516" />
        <path d="M 170 514 C 172 518 174 522 172 524" />
        <path d="M 248 514 C 252 518 258 522 262 524 C 266 524 268 520 266 516" />
        <path d="M 230 514 C 228 518 226 522 228 524" />
      </g>
    </g>
  );
};

export const Anatomy360HUD: React.FC = () => {
  const { getMuscleProgression, getAllMusclesProgression } = useWorkout();
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(false);
  const [activeMuscle, setActiveMuscle] = useState<MuscleGroup>('chest');
  const [isQuickLogOpen, setIsQuickLogOpen] = useState<boolean>(false);

  const allProgression = getAllMusclesProgression();

  useEffect(() => {
    if (!isAutoRotate) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [isAutoRotate]);

  const isBackView = rotationAngle > 90 && rotationAngle < 270;

  const handleMuscleClick = (mg: MuscleGroup) => {
    setActiveMuscle(mg);
    setIsQuickLogOpen(true);
  };

  // Callout definitions
  const calloutTargets: Array<{
    group: MuscleGroup;
    splitName: string;
    label: string;
    viewSide: 'front' | 'back';
    cx: number;
    cy: number;
    pointerSide: 'left' | 'right';
  }> = [
    { group: 'chest', splitName: 'PUSH', label: 'PECTORALIS MAJOR', viewSide: 'front', cx: 200, cy: 148, pointerSide: 'left' },
    { group: 'abs', splitName: 'CORE', label: 'RECTUS ABDOMINIS', viewSide: 'front', cx: 200, cy: 230, pointerSide: 'left' },
    { group: 'quads', splitName: 'LEGS', label: 'QUADRICEPS FEMORIS', viewSide: 'front', cx: 170, cy: 350, pointerSide: 'left' },
    { group: 'shoulders', splitName: 'PUSH', label: 'DELTOIDS', viewSide: 'front', cx: 138, cy: 130, pointerSide: 'right' },
    { group: 'biceps', splitName: 'PULL', label: 'BICEPS BRACHII', viewSide: 'front', cx: 122, cy: 188, pointerSide: 'right' },
    
    { group: 'back', splitName: 'PULL', label: 'TRAPEZIUS & LATS', viewSide: 'back', cx: 200, cy: 150, pointerSide: 'right' },
    { group: 'triceps', splitName: 'PUSH', label: 'TRICEPS BRACHII', viewSide: 'back', cx: 278, cy: 185, pointerSide: 'right' },
    { group: 'hamstrings', splitName: 'LEGS', label: 'HAMSTRINGS', viewSide: 'back', cx: 170, cy: 350, pointerSide: 'left' },
    { group: 'calves', splitName: 'LEGS', label: 'GASTROCNEMIUS', viewSide: 'back', cx: 250, cy: 450, pointerSide: 'left' },
  ];

  const currentCalls = calloutTargets.filter((c) => (isBackView ? c.viewSide === 'back' : c.viewSide === 'front'));

  return (
    <div className="relative w-full min-h-screen bg-[#0a1628] overflow-hidden">
      {/* Dot matrix background */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,200,255,0.15)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
      
      {/* Radial blue light from center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,100,180,0.25)_0%,transparent_70%)] pointer-events-none" />

      {/* Top bar */}
      <div className="relative z-20 flex items-center justify-between px-4 sm:px-8 pt-6 pb-4">
        <div className="flex items-center space-x-3">
          <Zap className="w-5 h-5 text-[#00d4ff] animate-pulse" />
          <div>
            <p className="text-[10px] font-mono font-bold text-[#00d4ff]/80 tracking-[0.2em] uppercase">Veritas Muscle Blueprint</p>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight">360° Anatomy Scanner</h2>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-xs font-mono">
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0a1628] border border-[#00d4ff]/40 text-[#00d4ff] hover:bg-[#00d4ff]/10 transition"
          >
            {isAutoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoRotate ? 'Pause' : 'Auto Spin'}</span>
          </button>
          <span className="px-3 py-1.5 rounded-lg bg-[#0a1628] border border-[#00d4ff]/30 text-[#00d4ff] font-bold">
            {Math.round(rotationAngle)}° {isBackView ? 'POST' : 'ANT'}
          </span>
        </div>
      </div>

      {/* Main viewport */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 items-start gap-4">

          {/* Left callouts */}
          <div className="md:col-span-3 space-y-3 pt-8">
            {currentCalls
              .filter((c) => c.pointerSide === 'left')
              .map((c) => {
                const prog = allProgression[c.group];
                const isSelected = activeMuscle === c.group;
                return (
                  <div
                    key={c.group}
                    onClick={() => handleMuscleClick(c.group)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#00d4ff]/10 border-[#00d4ff]/80 shadow-[0_0_16px_rgba(0,212,255,0.25)]'
                        : 'bg-[#0a1628]/80 border-[#00d4ff]/20 hover:border-[#00d4ff]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[9px] font-mono font-bold text-[#00d4ff]/70 tracking-widest">{c.splitName}</span>
                      <Plus className="w-3 h-3 text-[#00d4ff]/60" />
                    </div>
                    <h4 className="text-[11px] font-black text-white font-mono">{c.label}</h4>
                    <div className="flex items-center justify-between mt-1 text-[9px] font-mono text-slate-400">
                      <span>Vol: {prog.totalVolumeKg.toLocaleString()} kg</span>
                      <span className="text-[#00d4ff] font-bold">{prog.levelTitle.split('•')[0]}</span>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Center anatomy */}
          <div className="md:col-span-6 flex flex-col items-center relative">
            <div
              className="w-full max-w-[380px] relative"
              style={{
                transform: `rotateY(${rotationAngle}deg)`,
                transformStyle: 'preserve-3d',
                transition: isAutoRotate ? 'none' : 'transform 0.15s ease-out',
              }}
            >
              <svg viewBox="0 0 400 540" className="w-full h-auto" style={{ filter: 'drop-shadow(0 0 12px rgba(0,212,255,0.4))' }}>
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                <g filter="url(#glow)">
                  {isBackView ? (
                    <BackAnatomyPaths activeMuscle={activeMuscle} />
                  ) : (
                    <FrontAnatomyPaths activeMuscle={activeMuscle} />
                  )}
                </g>

                {/* Clickable muscle hotspot nodes */}
                {currentCalls.map((c) => {
                  const isSelected = activeMuscle === c.group;
                  return (
                    <g key={c.group} onClick={() => handleMuscleClick(c.group)} className="cursor-pointer">
                      <circle cx={c.cx} cy={c.cy} r={isSelected ? 12 : 7} fill="#00d4ff" fillOpacity={isSelected ? 0.5 : 0.2} stroke="#00d4ff" strokeWidth={isSelected ? 2 : 1} />
                      <circle cx={c.cx} cy={c.cy} r="3" fill="#00d4ff" />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Holographic pedestal ring */}
            <div className="relative w-64 h-10 -mt-4">
              <div className="absolute inset-0 rounded-[50%] border-2 border-[#00d4ff]/60 shadow-[0_0_30px_rgba(0,212,255,0.3)]" />
              <div className="absolute inset-2 rounded-[50%] border border-[#00d4ff]/30" />
              <div className="absolute inset-4 rounded-[50%] border border-[#00d4ff]/15" />
            </div>
          </div>

          {/* Right callouts */}
          <div className="md:col-span-3 space-y-3 pt-8">
            {currentCalls
              .filter((c) => c.pointerSide === 'right')
              .map((c) => {
                const prog = allProgression[c.group];
                const isSelected = activeMuscle === c.group;
                return (
                  <div
                    key={c.group}
                    onClick={() => handleMuscleClick(c.group)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#00d4ff]/10 border-[#00d4ff]/80 shadow-[0_0_16px_rgba(0,212,255,0.25)]'
                        : 'bg-[#0a1628]/80 border-[#00d4ff]/20 hover:border-[#00d4ff]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[9px] font-mono font-bold text-[#00d4ff]/70 tracking-widest">{c.splitName}</span>
                      <Plus className="w-3 h-3 text-[#00d4ff]/60" />
                    </div>
                    <h4 className="text-[11px] font-black text-white font-mono">{c.label}</h4>
                    <div className="flex items-center justify-between mt-1 text-[9px] font-mono text-slate-400">
                      <span>Vol: {prog.totalVolumeKg.toLocaleString()} kg</span>
                      <span className="text-[#00d4ff] font-bold">{prog.levelTitle.split('•')[0]}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Bottom rotation slider */}
      <div className="relative z-20 flex items-center justify-center px-6 pb-6">
        <div className="flex items-center space-x-4 bg-[#0a1628]/90 border border-[#00d4ff]/20 rounded-xl px-4 py-2.5 max-w-sm w-full">
          <RotateCw className="w-4 h-4 text-[#00d4ff] shrink-0" />
          <input
            type="range"
            min="0"
            max="360"
            value={rotationAngle}
            onChange={(e) => {
              setIsAutoRotate(false);
              setRotationAngle(parseFloat(e.target.value));
            }}
            className="w-full accent-[#00d4ff] cursor-pointer"
          />
          <span className="text-xs font-mono font-bold text-[#00d4ff] w-10 text-right">{Math.round(rotationAngle)}°</span>
        </div>
      </div>

      {/* Quick Log Modal */}
      <QuickLogModal
        isOpen={isQuickLogOpen}
        onClose={() => setIsQuickLogOpen(false)}
        muscleGroup={activeMuscle}
      />
    </div>
  );
};
