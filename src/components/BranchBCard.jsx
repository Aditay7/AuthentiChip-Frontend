import { CheckCircle2, XCircle, AlertCircle, ExternalLink, FileText } from 'lucide-react'
import { motion } from 'framer-motion'

const BranchBCard = ({ branchB }) => {
  if (!branchB) return null

  const isPass = branchB.overall_result === 'PASS'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card space-y-4 border border-slate-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-text-muted mb-1">Branch B</p>
          <h3 className="text-lg font-semibold text-text-primary">Data & Marking Verification</h3>
        </div>
        <div className={`flex items-center gap-2 text-sm ${isPass ? 'text-pass' : 'text-fail'}`}>
          {isPass ? (
            <CheckCircle2 className="w-6 h-6" />
          ) : (
            <XCircle className="w-6 h-6" />
          )}
          <span className="font-bold">{branchB.overall_result}</span>
        </div>
      </div>

      {/* B1: OCR & Text Verification */}
      {branchB.ocr_verification && (
        <section className="p-4 rounded-xl bg-bg-panel border border-border-color space-y-3">
          <h4 className="font-semibold text-sm flex items-center gap-2 text-text-primary">
            <FileText className="w-4 h-4" />
            OCR & Text Verification
          </h4>
          
          {/* Extracted Fields */}
          <div className="space-y-2 mb-3 text-sm">
            {branchB.ocr_verification.extracted_fields?.part_number && (
              <div>
                <span className="text-text-muted">Part Number: </span>
                <span className="font-mono font-semibold text-text-primary">
                  {branchB.ocr_verification.extracted_fields.part_number}
                </span>
              </div>
            )}
            {branchB.ocr_verification.extracted_fields?.manufacturer && (
              <div>
                <span className="text-text-muted">Manufacturer: </span>
                <span className="font-mono font-semibold text-text-primary">
                  {branchB.ocr_verification.extracted_fields.manufacturer}
                </span>
              </div>
            )}
            {branchB.ocr_verification.extracted_fields?.lot_code && (
              <div>
                <span className="text-text-muted">Lot/Date Code: </span>
                <span className="font-mono font-semibold text-text-primary">
                  {branchB.ocr_verification.extracted_fields.lot_code}
                </span>
              </div>
            )}
          </div>

          {/* Text Match Results */}
          <div className="space-y-2 text-sm">
            {branchB.ocr_verification.text_match_result && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Part Number Match:</span>
                  <span className={`font-semibold ${
                    branchB.ocr_verification.text_match_result.part_number_match === 'MATCH'
                      ? 'text-pass' : 'text-fail'
                  }`}>
                    {branchB.ocr_verification.text_match_result.part_number_match}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Manufacturer Match:</span>
                  <span className={`font-semibold ${
                    branchB.ocr_verification.text_match_result.manufacturer_match === 'MATCH'
                      ? 'text-pass' : 'text-fail'
                  }`}>
                    {branchB.ocr_verification.text_match_result.manufacturer_match}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Lot/Date Format:</span>
                  <span className={`font-semibold ${
                    branchB.ocr_verification.text_match_result.lot_date_format === 'VALID'
                      ? 'text-pass' : 'text-fail'
                  }`}>
                    {branchB.ocr_verification.text_match_result.lot_date_format}
                  </span>
                </div>
              </>
            )}
            {branchB.ocr_verification.ocr_confidence && (
              <div className="flex items-center justify-between mt-2">
                <span className="text-text-muted">OCR Confidence:</span>
                <span className="font-mono font-semibold text-text-primary">
                  {(branchB.ocr_verification.ocr_confidence * 100).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* B2: Datasheet & Rule Extraction */}
      {branchB.datasheet_verification && (
        <section className="p-4 rounded-xl bg-bg-panel border border-border-color space-y-3">
          <h4 className="font-semibold text-sm flex items-center gap-2 text-text-primary">
            <FileText className="w-4 h-4" />
            Datasheet & Rule Extraction
          </h4>
          
          <div className="space-y-2 mb-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Datasheet Status:</span>
              <span className={`font-semibold ${
                branchB.datasheet_verification.datasheet_status === 'FOUND'
                  ? 'text-pass' : 'text-fail'
              }`}>
                {branchB.datasheet_verification.datasheet_status}
              </span>
            </div>

            {branchB.datasheet_verification.oem_source_info && (
              <div className="mt-3 space-y-1">
                <div>
                  <span className="text-text-muted text-sm">OEM: </span>
                  <span className="font-semibold text-text-primary">
                    {branchB.datasheet_verification.oem_source_info.oem_name}
                  </span>
                </div>
                <div>
                  <span className="text-text-muted text-sm">Title: </span>
                  <span className="text-text-secondary text-sm">
                    {branchB.datasheet_verification.oem_source_info.datasheet_title}
                  </span>
                </div>
                {branchB.datasheet_verification.oem_source_info.version && (
                  <div>
                    <span className="text-text-muted text-sm">Version: </span>
                    <span className="text-text-secondary text-sm">
                      {branchB.datasheet_verification.oem_source_info.version}
                    </span>
                  </div>
                )}
                {branchB.datasheet_verification.oem_source_info.source_url && (
                  <a
                    href={branchB.datasheet_verification.oem_source_info.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline text-sm mt-2"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View Datasheet
                  </a>
                )}
              </div>
            )}

            {branchB.datasheet_verification.marking_rule_summary && (
              <div className="mt-3 p-3 rounded-lg bg-bg-card border border-border-color">
                <p className="text-xs uppercase tracking-[0.18em] text-text-muted mb-2 font-semibold">
                  Marking Rules
                </p>
                <div className="space-y-1 text-xs text-text-secondary">
                  {branchB.datasheet_verification.marking_rule_summary.expected_package_type && (
                    <div>
                      <span className="font-semibold">Package:</span>{' '}
                      <span className="font-mono">
                        {branchB.datasheet_verification.marking_rule_summary.expected_package_type}
                      </span>
                    </div>
                  )}
                  {branchB.datasheet_verification.marking_rule_summary.expected_top_marking && (
                    <div>
                      <span className="font-semibold">Expected Marking:</span>{' '}
                      <span className="font-mono">
                        {branchB.datasheet_verification.marking_rule_summary.expected_top_marking}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {branchB.datasheet_verification.rule_parsing_status && (
              <div className="flex items-center justify-between mt-2 text-sm">
                <span className="text-text-muted">Rule Extraction:</span>
                <span className={`font-semibold ${
                  branchB.datasheet_verification.rule_parsing_status === 'SUCCESS'
                    ? 'text-pass' : 'text-fail'
                }`}>
                  {branchB.datasheet_verification.rule_parsing_status}
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* B3: Layout & Position Check */}
      {branchB.layout_verification && (
        <section className="p-4 rounded-xl bg-bg-panel border border-border-color space-y-3">
          <h4 className="font-semibold text-sm mb-1 flex items-center gap-2 text-text-primary">
            <AlertCircle className="w-4 h-4" />
            Layout & Position Check
          </h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Layout Check:</span>
              <span className={`font-semibold ${
                branchB.layout_verification.layout_check_result === 'PASS'
                  ? 'text-pass' : 'text-fail'
              }`}>
                {branchB.layout_verification.layout_check_result}
              </span>
            </div>

            {branchB.layout_verification.position_deviation && (
              <div className="mt-2 space-y-1 text-sm">
                {branchB.layout_verification.position_deviation.logo_deviation !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-text-muted">Logo Deviation:</span>
                    <span className="font-mono text-text-primary">
                      {branchB.layout_verification.position_deviation.logo_deviation.toFixed(1)} px
                    </span>
                  </div>
                )}
                {branchB.layout_verification.position_deviation.text_block_deviation !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-text-muted">Text Block Deviation:</span>
                    <span className="font-mono text-text-primary">
                      {branchB.layout_verification.position_deviation.text_block_deviation.toFixed(1)} px
                    </span>
                  </div>
                )}
              </div>
            )}

            {branchB.layout_verification.layout_flags && (
              <div className="mt-3 space-y-1">
                {branchB.layout_verification.layout_flags.text_misaligned && (
                  <div className="flex items-center gap-2 text-fail text-sm">
                    <XCircle className="w-3 h-3" />
                    <span>Text present but misaligned</span>
                  </div>
                )}
                {branchB.layout_verification.layout_flags.logo_missing && (
                  <div className="flex items-center gap-2 text-fail text-sm">
                    <XCircle className="w-3 h-3" />
                    <span>Logo missing</span>
                  </div>
                )}
                {branchB.layout_verification.layout_flags.extra_unknown_marking && (
                  <div className="flex items-center gap-2 text-fail text-sm">
                    <XCircle className="w-3 h-3" />
                    <span>Extra unknown marking detected</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </motion.div>
  )
}

export default BranchBCard

