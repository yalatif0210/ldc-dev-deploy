package com.markov.lab.input;

import java.util.List;

public record ReportDetailInput(
       long report_id,
       long status_id,
       List<LabInformation> lab_information_data_inputs,
       List<IntrantInformation> intrant_information_data_inputs
) {
}
